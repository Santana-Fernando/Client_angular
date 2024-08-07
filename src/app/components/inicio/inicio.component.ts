import { Component, OnInit } from '@angular/core';
import { ApiService, ITarefa } from '../../services/api.service';
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

  popoverTitle = 'Remover tarefa';
  popoverMessage = 'Deseja excluir o tarefa?';
  confirmClicked = false;
  cancelClicked = false;

  constructor(private ApiService: ApiService, private router: Router, private toastr: ToastrService, private http: HttpClient) {
  
  }

  ngOnInit(): void {
    this.listar()
  }

  listar() {
    this.ApiService.listarTarefas().subscribe(
      res => this.Tarefas =<any>res,
      err => this.toastr.error(err)
    );
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

}
