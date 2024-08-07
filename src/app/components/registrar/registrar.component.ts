import { Component, OnInit } from '@angular/core';
import { ApiService, ITarefa, ITarefaSituacao } from '../../services/api.service';
import { Router } from '@angular/router'; 
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css']
})

export class RegistrarComponent implements OnInit {

  Tarefa: ITarefa = {
    Id: '',
    sNmTitulo:'',
    sDsSLA:'',
    tDtCadastro: new Date(Date.now()),
    nStSituacao: 1
  };

  Situacoes: ITarefaSituacao = {
    Id: '',
    sNmSituacao:'',
  }

  constructor(private ApiService: ApiService, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  async registrarNovaTarefa() {
    delete this.Tarefa.Id;

    let validacoes = await this.ApiService.validarCampo(this.Tarefa)

    if(validacoes != true) {
      this.toastr.warning(validacoes)
      return
    }

    this.ApiService.addTarefas(this.Tarefa).subscribe(
      (res: any) => {
        this.toastr.success("Operação realizada com sucesso")
        this.router.navigate(['/inicio'])
      },
      (error) => {
        console.log(error);
        this.toastr.error(error.error)
      }
    )
  }
}
