import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  isLoggedIn: boolean;

  constructor(private router: Router, private authService: AuthService) {
  }

  ngOnInit(): void {
    const customer = JSON.parse(localStorage.getItem('customer'));
    this.isLoggedIn = !!customer;
  }

  onClickShowRegistrationForm(): void {
    this.router.navigate(['/register']);
  }

  onClickShowLogInForm(): void {
    this.router.navigate(['/log-in']);
  }

  onClickShowDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  onClickLogOut(): void {
    this.authService.logOut().then(
      () => this.isLoggedIn = false
    );
  }

}
