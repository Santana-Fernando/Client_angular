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

  selectedFile!: File;

  Tarefa: ITarefa = {
    Id: '',
    sNmTitulo:'',
    sDsSLA:'',
    sDsCaminhoAnexo:'',
    tDtCadastro: new Date(Date.now()),
    nStSituacao: 1
  };

  Situacoes: ITarefaSituacao = {
    Id: 0,
    sNmSituacao:'',
  }

  constructor(private ApiService: ApiService, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  async registrarNovaTarefa() {
    delete this.Tarefa.Id;

    let validacoes = await this.ApiService.validarCampo(this.Tarefa);
    if (validacoes !== true) {
        this.toastr.warning(validacoes);
        return;
    }

    this.ApiService.uploadFile(this.selectedFile).subscribe(
        (response) => {
            const sDsCaminhoAnexo = response.FilePath;
            this.Tarefa.sDsCaminhoAnexo = sDsCaminhoAnexo;  // Supondo que você precisa atribuir o caminho ao objeto Tarefa

            // Agora que temos o caminho do anexo, podemos chamar o addTarefas
            this.ApiService.addTarefas(this.Tarefa).subscribe(
                (res: any) => {
                    this.toastr.success("Operação realizada com sucesso");
                    this.router.navigate(['/inicio']);
                },
                (error) => {
                    console.log(error);
                    this.toastr.error(error.error);
                }
            );
        },
        (error) => {
            console.log(error);
            this.toastr.error("Erro ao fazer upload do arquivo");
        }
    );
}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  async onUpload(): Promise<string> {
    if (this.selectedFile) {
      await this.ApiService.uploadFile(this.selectedFile).subscribe((response) => {
        return response.FilePath;
      }, (error) => {
        console.log(error);
      });
    }

    return "";
  }
}
