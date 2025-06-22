import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Route, Router, RouterLink } from '@angular/router';
import { UserServiceService } from '../../services/user/user-service.service';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { AlertService } from '../../services/alert/alert.service';
import { CartService } from '../../services/cart/cart.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  private alertService = inject(AlertService);
  private cartService = inject(CartService);

  loginForm: FormGroup;
  showPassword: boolean = false

  constructor(
    private fb: FormBuilder, 
    private usrService: UserServiceService, 
    private localStorageService: LocalStorageService,
    private router: Router
  ) {
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

  const{email, password} = this.loginForm.value;

  this.usrService.postIniciarSesion({email,password}).subscribe({
    next: (response) => {
          // Guardar token o datos de usuario si vienen en la respuesta
          // Mostrar la cookie 'session_ID' en la consola:
          const cookies = document.cookie; // Todas las cookies accesibles para la ruta y dominio actual
          console.log('Cookies actuales:', cookies);

          // Si quieres solo la cookie session_ID:
          const sessionCookie = cookies.split('; ').find(row => row.startsWith('session_ID='));
          console.log('Cookie session_ID:', sessionCookie);

          // Agrego la sessionID al localStorage
          const sessionID = sessionCookie?.split('=')[1];
          this.localStorageService.setItem('session_ID', sessionID);
          this.cartService.updateQuantity(Number(sessionID));

          console.log('Login exitoso:', response);
          this.alertService.AlertTopCorner('Succes','Iniciaste secion exitosamente');
          this.router.navigate(['/home']);
      },
        error: (error) => {
          console.error('Error al iniciar sesión:', error);
          const msg = error.error?.Mensaje;
          this.alertService.showError('Error',msg);
      }
    });
  }

  togglePasswordVisivility(): void {
    this.showPassword = !this.showPassword
  }

}
