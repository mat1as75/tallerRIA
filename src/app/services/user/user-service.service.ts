import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { User } from '../../interfaces/User.interface';
import { Gestor } from '../../interfaces/Gestor.interface';
import { Pedido } from '../../interfaces/Pedido.interface';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
 private apiPhp = environment.apiphp;

  constructor(private http: HttpClient) { }

  postRegisterUser(user : User) {
    return this.http.post<User>(`${this.apiPhp}/usuarios`, user, {withCredentials: true})
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

  ObtenerUsuario(id: string){
    return this.http.get<User>(`${this.apiPhp}/usuarios/${id}`,{withCredentials: true})
  }

  cerrarsesion(id: string){
     return this.http.post<any>(`${this.apiPhp}/cerrarsesion/${id}`,{withCredentials: true})    

  }

   deleteuser(id: string){
     return this.http.post<any>(`${this.apiPhp}/desactivarcuenta/${id}`,{withCredentials: true})    
  }


    ObtenerCompras(id: string){
    return this.http.get<Pedido[]>(`${this.apiPhp}/historialcompras/${id}`,{withCredentials: true})
  }

  cambiopassDetalle(pass: {email: string, password: string, nuevapass: string}){
    return this.http.put<any>(`${this.apiPhp}/cambiopassdesdedetalles`, pass)
    
  }

  //ALTA GESTOR
  postRegisterGestor(gestor : Gestor) {

    return this.http.post<Gestor>(`${this.apiPhp}/usuarios`, gestor, {withCredentials: true})
  
  }

   //MODIFICAR GESTOR
  postModifciarGestor(gestor : Gestor) {

    return this.http.put<Gestor>(`${this.apiPhp}/modificarGestor`, gestor, {withCredentials: true})
    //http://localhost/php/tallerPHP/public/index.php/modificarGestor
    
  
  }



}
