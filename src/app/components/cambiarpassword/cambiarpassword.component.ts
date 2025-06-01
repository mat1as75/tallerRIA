import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserServiceService } from '../../services/user/user-service.service';

@Component({
  selector: 'app-cambiarpassword',
  imports: [FormsModule],
  templateUrl: './cambiarpassword.component.html',
  styleUrl: './cambiarpassword.component.scss'
})
export class CambiarpasswordComponent implements OnInit {

  token: string = '';
  email: string = '';
  password: string = '';

  constructor( private route: ActivatedRoute, private usrservice: UserServiceService ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      this.email = params['email'];
      console.log('Token:', this.token);
      console.log('Email:', this.email);
    });
  }

  cambiarpassword() {
    const payload = {
      email: this.email,
      token: this.token,
      password: this.password
    };

    this.usrservice.updatePassword(payload).subscribe({
      next: (res) => console.log('Contraseña cambiada con éxito'),
      error: (err) => console.error('Error:', err)
    });
  }

}
