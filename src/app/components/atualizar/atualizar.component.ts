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

  selectedFile!: File;

  SituacaoTarefa: ITarefaSituacao[] = [
    { Id: 0, sNmSituacao: '' },
  ];

  Tarefa: ITarefa = {
    Id: '',
    sNmTitulo:'',
    sDsSLA:'',
    sDsCaminhoAnexo:'',
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

  async atualizar() {
    const tarefaId = this.activatedRoute.snapshot.params['id'];

    if (!await this.isTarefaValida()) return;

    try {
        if (this.selectedFile) {
            await this.atualizarArquivoAnexo();
        }
        await this.atualizarTarefa();
        this.toastr.success("Operação realizada com sucesso");
        this.router.navigate(['/inicio']);
    } catch (error) {
        this.tratarErro(error, "Erro ao atualizar tarefa");
    }
  }

  private async isTarefaValida(): Promise<boolean> {
      const validacoes = await this.ApiService.validarCampo(this.Tarefa);
      if (validacoes !== true) {
          this.toastr.warning(validacoes);
          return false;
      }
      return true;
  }

  private async atualizarArquivoAnexo(): Promise<void> {
      try {
          const response = await this.ApiService.atualizarArquivo(this.Tarefa.sDsCaminhoAnexo, this.selectedFile).toPromise();
          this.Tarefa.sDsCaminhoAnexo = response.FilePath;
      } catch (error) {
          this.tratarErro(error, "Erro ao fazer upload do arquivo");
          throw error;
      }
  }

  private async atualizarTarefa(): Promise<void> {
      try {
          await this.ApiService.atualizarTarefas(this.Tarefa).toPromise();
      } catch (error) {
          this.tratarErro(error, "Erro ao atualizar tarefa");
          throw error;
      }
  }

  private tratarErro(error: any, mensagemPadrao: string): void {
      console.error(error);
      this.toastr.error(error.error || mensagemPadrao);
  }
}
