import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  url="https://localhost:44380/api/Tarefa";
  constructor(private http: HttpClient) {}

  listarTarefas() {
    return this.http.get(this.url + '/GetList')
  }

  listarSituacaoTarefas() {
    return this.http.get(this.url + '/GetListSituacao')
  }

  listarTarefasPorId(id: string) {
    return this.http.get(this.url+'/GetById?id='+id)
  }

  uploadFile(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post(`${this.url}/upload`, formData);
  }

  downloadFile(fileName: string): Observable<Blob> {
    return this.http.get(`${this.url}/download?fileName=${fileName}`, { responseType: 'blob' });
  }
  
  addTarefas(tarefa: any) {
    return this.http.post(this.url+'/Register', tarefa)
  }

  atualizarTarefas(tarefa: any) {
    return this.http.put(this.url+'/Update', tarefa)
  }

  removerTarefas(id: string | undefined) {
    return this.http.delete(this.url+'/Remove?id='+id)
  }

  buscarPorCep(cep:string | undefined){
    return this.http.get(`https://viacep.com.br/ws/${cep}/json/`)
  }

  validarCampo(tarefa: any) {
    let { sNmTitulo, sDsSLA } = tarefa

    if(!this.hasValue(sNmTitulo)) return 'Insira o título da tarefa'
    if(sNmTitulo.length > 100 || sNmTitulo.length < 3) return 'Faça uma descrição de 3 a 100 caracteres'
    if(!this.hasValue(sDsSLA)) return 'Insira o sDsSLA da tarefa'
    if(sDsSLA.length > 5 || sDsSLA.length < 2) return 'Informe um valor entre 2 a 5 dígitos'    
    if(Number.isNaN(sDsSLA)) return 'Informe um número válido'

    return true
  }

  hasValue(value: string | undefined) {
    if(value != null && value != "") return true;
	  else return false;
  }
}

export interface ITarefa {
  Id?: string;
  sNmTitulo: string;
  sDsCaminhoAnexo?: string;
  sDsSLA?: string;
  tDtCadastro: Date;
  nStSituacao: number;
}

export interface ITarefaSituacao {
  Id: number;
  sNmSituacao: string;
}
