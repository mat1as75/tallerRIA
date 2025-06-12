import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Route, Router, RouterLink } from '@angular/router';
import { UserServiceService } from '../../services/user/user-service.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

loginForm: FormGroup;

constructor(private fb: FormBuilder, private usrService: UserServiceService, private router: Router){
  this.loginForm = this.fb.group({
    email:['', [Validators.required, Validators.email]],
    password:['', [Validators.required]]
  })
}

onSubmit(){

  if(this.loginForm.invalid){
    this.loginForm.markAllAsTouched();
    return;
}

  console.log(this.loginForm.value);  // <--- Aquí chequea



const{email,password} = this.loginForm.value;

this.usrService.postIniciarSesion({email,password}).subscribe({
  next: (response) => {
        // Guardar token o datos de usuario si vienen en la respuesta
        // localStorage.setItem('token', response.token); // si tu backend lo manda
            // Mostrar la cookie 'session_ID' en la consola:
    const cookies = document.cookie; // Todas las cookies accesibles para la ruta y dominio actual
    console.log('Cookies actuales:', cookies);

    // Si quieres solo la cookie session_ID:
    const sessionCookie = cookies.split('; ').find(row => row.startsWith('session_ID='));
    console.log('Cookie session_ID:', sessionCookie);

        console.log('Login exitoso:', response);
        this.router.navigate(['/home']); // redirige a la página de inicio
      },
      error: (error) => {
        console.error('Error al iniciar sesión:', error);
        alert('Correo o contraseña incorrectos');
      }
    });
  



}

}
