import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { User } from '../../interfaces/User.interface';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
 private apiPhp = environment.apiphp;

  constructor(private http: HttpClient) { }


  postRegisterUser(user : User) {
    return this.http.post<User>(`${this.apiPhp}/usuarios`, user)
  }

  postIniciarSesion(user: {email: string, password: string}){
    return this.http.post<any>(`${this.apiPhp}/inisiarsesion`, user, {withCredentials: true})
  }

  updatePassword(pass: {email: string, token: string, password: string}){
    return this.http.put<any>(`${this.apiPhp}/cambiopassword`, pass)
  }

  recuperarPassword(email : {email: string}){
    return this.http.put<any>(`${this.apiPhp}/recuperarpassword`, email)
  }

  verificarToken(token : {token: string}){
    return this.http.post<{ valido: boolean }>(`${this.apiPhp}/verificotoken`,token)
  }

}
