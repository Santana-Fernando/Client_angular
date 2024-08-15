import { Component, OnInit } from '@angular/core';
import { ApiService, ITarefa, ITarefaSituacao } from '../../services/api.service';
import { Router  } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})

export class InicioComponent implements OnInit {

  Tarefas: ITarefa[] = [];
  SituacaoTarefa: ITarefaSituacao[] = [];

  popoverTitle = 'Remover tarefa';
  popoverMessage = 'Deseja excluir o tarefa?';
  confirmClicked = false;
  cancelClicked = false;

  private situacaoMap: { [key: number]: string } = {
    1: 'situacao text-white bg-secondary',
    2: 'situacao text-white bg-primary',
    3: 'situacao text-white bg-warning',
    4: 'situacao text-white bg-danger'
  };

  constructor(private ApiService: ApiService, private router: Router, private toastr: ToastrService, private http: HttpClient) {
  
  }

  ngOnInit(): void {
    this.listar()
    this.listarSituacaoTarefas()
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

  listar() {
    this.ApiService.listarTarefas().subscribe(
      res => this.Tarefas =<any>res,
      err => this.toastr.error(err)
    );
  }

  retornarSituacao(situacaoId: number | string): string {
    const id = typeof situacaoId === 'string' ? Number(situacaoId) : situacaoId;
    if (isNaN(id)) return 'Desconhecida';    
    const situacao = this.SituacaoTarefa.find(s => s.Id === id);
    return situacao ? situacao.sNmSituacao : 'Desconhecida';
  }

  retornarSituacaoText(id: number): string {
    return this.situacaoMap[id] || 'situacao text-white bg-success';
  }

  remover(id:string | undefined, sNmTitulo: string) {
    localStorage.removeItem(sNmTitulo);
    this.ApiService.removerTarefas(id).subscribe(
      (res: any) => {
        if(res == 200) this.listar();
      },
      err => console.log(err)
    );
  }

  atualizar(id:string | undefined) {
    this.router.navigate(['/editar/'+id])
  }

  novo() {
    this.router.navigate(['/novo'])
  }

  download(fileName: string) {
    this.ApiService.downloadFile(fileName).subscribe((blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }, (error) => {
      console.error('Erro ao baixar o arquivo:', error);
    });
  }
}
