import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from '../../services/cookies/cookie.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  constructor(private router: Router, private servicecookie:CookieService){}



checkCookieRedirect(){
  const session = this.servicecookie.getCookie('session_ID');
  console.log('Cookie leída:', session);
  if (session) {
    this.router.navigate(['/detallesdecuenta']);
  } else {
    this.router.navigate(['/login']);
  }
}

}





