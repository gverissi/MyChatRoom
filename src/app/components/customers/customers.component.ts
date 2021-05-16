import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Customer} from '../../entities/customer/customer';
import {CustomerDaoService} from '../../services/customer-dao/customer-dao.service';
import {Subscription} from 'rxjs';
import {AuthService} from '../../services/auth/auth.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit, OnDestroy {

  @Input()  messageToInCustomers: string;
  @Output() messageToInCustomersChange = new EventEmitter<string>();

  customerName: string = null;

  subscriptionAuth: Subscription;

  subscriptionFindAllCustomers: Subscription;
  customers: Customer[] = [];
  subscriptionFindByName: Subscription;
  nbNewMessages = 0;

  constructor(private customerDao: CustomerDaoService, private authService: AuthService) {
    this.customerName = localStorage.getItem('customerName');
  }

  ngOnInit(): void {
    this.subscriptionAuth = this.authService.getAuthState().subscribe(user => {
      if (user) {
        this.subscriptionFindAllCustomers = this.customerDao.findAll().subscribe(customers =>
          this.customers = customers.filter(customer => customer.name !== this.customerName)
        );
        this.subscriptionFindByName = this.customerDao.findByName(this.customerName).subscribe(actualCustomer => {
          const messages = actualCustomer.newMessages.filter(message => message.to === '-');
          this.nbNewMessages = messages.length;
        });
        this.customerDao.updateChannel(this.customerName, '-');
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptionFindByName.unsubscribe();
    this.subscriptionFindAllCustomers.unsubscribe();
    this.subscriptionAuth.unsubscribe();
  }

  changeCustomerNameForMassageTo(customerName: string): void {
    this.messageToInCustomers = customerName;
    this.messageToInCustomersChange.emit(this.messageToInCustomers);
    this.customerDao.updateChannel(this.customerName, customerName);
  }

}
