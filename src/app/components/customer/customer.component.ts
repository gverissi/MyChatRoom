import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Customer} from '../../entities/customer/customer';
import {Subscription} from 'rxjs';
import {AuthService} from '../../services/auth/auth.service';
import {CustomerDaoService} from '../../services/customer-dao/customer-dao.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit, OnDestroy {

  @Input() customer: Customer;

  customerName: string = null;
  subscriptionFindByName: Subscription;
  nbNewMessages = 0;

  constructor(private authService: AuthService, private customerDao: CustomerDaoService) {
    this.customerName = localStorage.getItem('customerName');
  }

  ngOnInit(): void {
    this.subscriptionFindByName = this.customerDao.findByName(this.customerName).subscribe(actualCustomer => {
      const messages = actualCustomer.newMessages.filter(message =>
        (message.from === this.customer.name) && (message.to === this.customerName)
      );
      this.nbNewMessages = messages.length;
    });
  }

  ngOnDestroy(): void {
    this.subscriptionFindByName.unsubscribe();
  }

}
