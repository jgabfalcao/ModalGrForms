import { Component } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface Formulario{
  nome: string;
  cpf: string;
  dataNascimento: string;
  email: string;
  cep: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  estado: string;
}

@Component({
  selector: 'app-formulario',
  imports: [FormsModule, HttpClientModule],
  templateUrl: './formulario.component.html',
  styleUrl: './formulario.component.css',
  standalone: true
})

export class FormularioComponent{
  form: Formulario ={
    nome: '',
    cpf: '',
    dataNascimento: '',
    email: '',
    cep: '',
    logradouro: '',
    bairro: '',
    cidade: '',
    estado: ''
  };

  constructor(private http: HttpClient){}

  enviarFormulario(): void{
    console.log('Dados do formulário preenchido: ', this.form);
    alert('Formulário enviado com sucesso!');
  }

  buscarCep(): void{
    if(this.form.cep.length === 8){
      this.http.get<any>(`https://viacep.com.br/ws/${this.form.cep}/json/`).subscribe(dados => {
        if(!dados.erro){
          this.form.logradouro = dados.logradouro;
          this.form.bairro = dados.bairro;
          this.form.cidade = dados.localidade;
          this.form.estado = dados.uf;
        }
      })
    } else{
      alert('CEP inválido');
    }
  }  

}
