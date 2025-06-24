import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserServiceService } from '../../services/user/user-service.service';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-cambiarpassword',
  imports: [FormsModule, RouterModule],
  templateUrl: './cambiarpassword.component.html',
  styleUrl: './cambiarpassword.component.scss'
})
export class CambiarpasswordComponent implements OnInit {

  token: string = '';
  email: string = '';
  password: string = '';
  tokenValido: boolean = false;

  private tokenSubject = new Subject<string>();

  constructor(private router: Router,private route: ActivatedRoute, private usrservice: UserServiceService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      this.email = params['email'];
      console.log(this.token);
      if(this.token){
        this.verificarToken();
      }
 });
  


    // Verificación automática con debounce
    this.tokenSubject.pipe(debounceTime(500)).subscribe(token => {
      this.usrservice.verificarToken({ token }).subscribe({
            next: (resp) => this.tokenValido = resp.valido,
            error: () => this.tokenValido = false
      });
    });
  }


  
    verificarToken(){
      this.tokenSubject.next(this.token);
    }

   

  cambiarpassword() {
    const payload = {
      email: this.email,
      token: this.token,
      password: this.password
    };

    this.usrservice.updatePassword(payload).subscribe({
      next: (res)=>(
        console.log('Contraseña cambiada con éxito', res),
        this.router.navigate(['/login'])
      ),
      
      error: (err) => console.error('Error:', err)
    });
  }
}
