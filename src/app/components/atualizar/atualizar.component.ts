import { Component, OnInit } from '@angular/core';
import { ApiService, ITarefa, ITarefaSituacao } from '../../services/api.service';
import { Router, ActivatedRoute } from '@angular/router'; 
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-atualizar',
  templateUrl: './atualizar.component.html',
  styleUrls: ['./atualizar.component.css']
})

export class AtualizarComponent implements OnInit {

  SituacaoTarefa: ITarefaSituacao[] = [
    { Id: 0, sNmSituacao: '' },
  ];

  Tarefa: ITarefa = {
    Id: '',
    sNmTitulo:'',
    sDsSLA:'',
    tDtCadastro: new Date(Date.now()),
    nStSituacao: 0
  };

  constructor(private ApiService: ApiService, private router: Router, private activatedRoute:ActivatedRoute, private toastr: ToastrService) { }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params['id']
    
    this.listarSituacaoTarefas();
    this.getTarefaById(id);
  }

  listarSituacaoTarefas(){
    this.ApiService.listarSituacaoTarefas().subscribe(
      (res: any) => {
        this.SituacaoTarefa = res
      },
      (err) =>  {
        this.toastr.error(err)
      }
    )
  }

  onSituacaoChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.Tarefa.nStSituacao = Number(selectElement.value);
    console.log('nStSituacao atualizado para:', this.Tarefa.nStSituacao);
  }

  getTarefaById(id: string) {
    this.ApiService.listarTarefasPorId(id).subscribe(
      (res: any) => {
        console.log(res)
        this.Tarefa = res
      },
      (err) =>  {
        this.toastr.error(err)
      }
    )
  }

  async atualizar() {
    const id = this.activatedRoute.snapshot.params['id']
    this.Tarefa.Id
    
    let validacoes = await this.ApiService.validarCampo(this.Tarefa)

    if(validacoes != true) {
      this.toastr.warning(validacoes)
      return
    }

    this.ApiService.atualizarTarefas(this.Tarefa).subscribe(
      (res: any) => {
        this.toastr.success("Operação realizada com sucesso")
        this.router.navigate(['/inicio'])
      },
      (err) =>  this.toastr.error(err)
    )
  }
}
