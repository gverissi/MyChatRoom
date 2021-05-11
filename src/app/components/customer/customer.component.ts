import { Component, Input, OnInit } from '@angular/core';
import {Customer} from '../../entities/customer/customer';
import {Subscription} from 'rxjs';
import {AuthService} from '../../services/auth/auth.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  @Input()
  customer: Customer;

  subscriptionAuth: Subscription;
  nbNewMessages = 0;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.subscriptionAuth = this.authService.getAuthState().subscribe(user => {
      if (user) {
        const messages = this.customer.newMessages.filter(to => to === user.displayName);
        this.nbNewMessages = messages.length;
      }
    });
  }

}
