import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';
import {CustomerDaoService} from '../../services/customer-dao/customer-dao.service';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

  isLoggedIn: boolean;
  customerName: string;
  subscription: Subscription;

  constructor(private authService: AuthService, private userDao: CustomerDaoService, private router: Router) { }

  ngOnInit(): void {
    this.subscription = this.authService.getAuthState().subscribe(user => {
      if (user) {
        this.isLoggedIn = true;
        this.customerName = localStorage.getItem('customerName');
      } else {
        this.isLoggedIn = false;
        this.customerName = 'not-logged';
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onClickLogOutUser(): void {
    this.authService.logOut().then(
      () => this.router.navigate(['/home'])
    );
  }

}
