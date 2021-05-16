import {Component, OnDestroy, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {AuthService} from './services/auth/auth.service';
import {CustomerDaoService} from './services/customer-dao/customer-dao.service';
import {Subscription} from 'rxjs';
import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'MyChatRoom';
  subscriptionAuth: Subscription;
  subscriptionCustomer: Subscription;
  favIcon: HTMLLinkElement = document.querySelector('#appIcon');

  public constructor(private titleService: Title, private authService: AuthService, private customerDao: CustomerDaoService) {
    console.log('environment.production = ', environment.production);
  }

  ngOnInit(): void {
    this.subscriptionAuth = this.authService.getAuthState().subscribe(user => {
      if (user) {
        const customerName = localStorage.getItem('customerName');
        this.subscriptionCustomer = this.customerDao.findByName(customerName).subscribe(customer => {
          const nbUnreadMessages = customer.newMessages.length;
          if (nbUnreadMessages > 0) {
            this.titleService.setTitle('(' + nbUnreadMessages + ') ' + this.title);
            this.favIcon.href = 'favicon-red.ico';
          } else {
            this.titleService.setTitle(this.title);
            this.favIcon.href = 'favicon.ico';
          }
        });
      } else {
        if (this.subscriptionCustomer) {
          this.subscriptionCustomer.unsubscribe();
        }
        this.titleService.setTitle(this.title);
        this.favIcon.href = 'favicon.ico';
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptionCustomer.unsubscribe();
    this.subscriptionAuth.unsubscribe();
  }

}
