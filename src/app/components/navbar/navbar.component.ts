import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';
import {CustomerDaoService} from '../../services/customer-dao/customer-dao.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isLoggedIn: boolean;
  userName: string;

  constructor(private authService: AuthService, private userDao: CustomerDaoService) { }

  ngOnInit(): void {
    this.authService.getAuthState().subscribe(user => {
      if (user) {
        this.isLoggedIn = true;
        this.userDao.findByEmail(user.email).subscribe(doc => {
          if (doc.exists) {
            this.userName = doc.data().name;
          } else {
            console.log('navbar: customer not found');
          }
        });
      } else {
        this.isLoggedIn = false;
        this.userName = 'not-logged';
      }
    });
  }

  onClickLogOutUser(): void {
    this.authService.logOut().then(
      value => console.log('value = ', value),
      reason => console.log('reason = ', reason)
    );
  }

}
