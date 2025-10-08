import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as uuid from 'uuid';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-clave-unica',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clave-unica.component.html',
  styleUrl: './clave-unica.component.scss'
})
export class ClaveUnicaComponent {
  @Input() isMobile: boolean = false;
  @Input() hasMenu: boolean = false;
  @Input() buttonText: string = 'Iniciar sesión';


  clientId = environment.clientIdClaveUnica;
  redirectUri = environment.redirecUriClaveUnica;
  response_type= 'code'
  scope = 'openid run name'



  loginClaveUnica(){

    //uri encodeado
    const encodedUrl = encodeURIComponent(this.redirectUri);

    //este valor debe ser un codigo alfanumerico aleatorio como identificador unico de sesión.wid
    const state = uuid.v4();

    //url de autorización de Clave Única
    const url = `https://accounts.claveunica.gob.cl/openid/authorize/?`;
    const params = `client_id=${this.clientId}&response_type=${this.response_type}&scope=${this.scope}&redirect_uri=${this.redirectUri}&state=${state}`;


    //se realiza la redirección del navegador a la URL construida con los parámetros. 
    //En este punto, el usuario ingresará sus credenciales (RUT y clave) en la página de Clave Única.
    window.location.href =  url + params;
  }
}
