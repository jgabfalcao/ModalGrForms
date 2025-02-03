import { Component } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';


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

  formatarCpf(): void {
    let cpf = this.form.cpf.replace(/\D/g, '');
    if (cpf.length <= 11) {
      cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
      cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
      cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    this.form.cpf = cpf;
  }

  validarCpf(): void {
    const cpf = this.form.cpf.replace(/\D/g, '');
    if (cpf.length === 11 ){
      if (!cpfValidator.isValid(cpf)) {
        alert('CPF inválido');
        this.form.cpf = '';
      }
    } 
    
  }

  validarDataNascimento(): void {
    const dataNascimento = new Date(this.form.dataNascimento);
    const dataAtual = new Date();

    if (dataNascimento > dataAtual) {
      alert('A data de nascimento não pode ser maior que a data atual!');
      this.form.dataNascimento = '';
    }
  }

  validarEmail(): void {
    const email = this.form.email.trim();

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailPattern.test(email)) {
      alert('E-mail inválido! Insira um e-mail no formato correto (exemplo@dominio.com).');
      this.form.email = '';
    }
  }

  formatarCep(): void {
    let cepFormat = this.form.cep.replace(/\D/g, '');

    if (cepFormat.length > 5) {
      cepFormat = cepFormat.substring(0, 5) + '-' + cepFormat.substring(5, 8); // Aplica o formato 00000-000
    }

    this.form.cep = cepFormat;
  }

  buscarCep(): void {
    const cep = this.form.cep.replace(/\D/g, '');
  
    if (cep.length === 8) {
      this.http.get<any>(`https://viacep.com.br/ws/${cep}/json/`).subscribe(
        (dados) => {
          if (!dados.erro) {
            this.form.logradouro = dados.logradouro;
            this.form.bairro = dados.bairro;
            this.form.cidade = dados.localidade;
            this.form.estado = dados.uf;
          } else {
            alert('CEP não encontrado');
            this.limparEndereco();
          }
        },
        (error) => {
          alert('Erro ao buscar CEP. Verifique se digitou corretamente.');
          this.limparEndereco();
        }
      );
    } else {
      this.limparEndereco();
    }
  }

  limparEndereco(): void {
    this.form.logradouro = '';
    this.form.bairro = '';
    this.form.cidade = '';
    this.form.estado = '';
  }

}
