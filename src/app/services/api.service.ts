import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  url="https://localhost:44380/api/Tarefa";
  constructor(private http: HttpClient) {}

  listarTarefas() {
    return this.http.get(this.url + '/GetList')
  }

  listarTarefasPorId(id: string) {
    return this.http.get(this.url+'/GetById?id='+id)
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
    if(!this.hasValue(sDsSLA)) return 'Insira o sDsSLA da tarefa'

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
  Id: string;
  sNmSituacao: string;
}