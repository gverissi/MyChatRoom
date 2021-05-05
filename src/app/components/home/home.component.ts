import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth/auth.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  isLoggedIn: boolean;
  subscription: Subscription;

  constructor(private router: Router, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.subscription = this.authService.getAuthState().subscribe(user => this.isLoggedIn = !!user);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onClickShowLogInForm(): void {
    this.router.navigate(['/log-in']);
  }

  onClickShowRegistrationForm(): void {
    this.router.navigate(['/register']);
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
