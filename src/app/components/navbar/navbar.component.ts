import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isLoggedIn: boolean;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.getAuthState().subscribe(user => {
      this.isLoggedIn = !!user;
    });
  }

  onClickLogOutUser(): void {
    this.authService.logOut().then(
      value => console.log('value = ', value),
      reason => console.log('reason = ', reason)
    );
  }

}
