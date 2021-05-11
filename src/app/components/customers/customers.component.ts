import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {map} from 'rxjs/operators';
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

  customers: Customer[] = [];
  subscription: Subscription;
  subscriptionAuth: Subscription;

  @Input()  messageToInCustomers: string;
  @Output() messageToInCustomersChange = new EventEmitter<string>();

  constructor(private customerDao: CustomerDaoService, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.subscriptionAuth = this.authService.getAuthState().subscribe(user => {
      if (user) {
        this.subscription = this.customerDao.findAll().pipe(
          map(changes => changes.map(c => ({ ...c.payload.doc.data() })))).subscribe(data => {
          this.customers = data.filter(c => c.name !== user.displayName).sort();
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.subscriptionAuth.unsubscribe();
  }

  changeCustomerNameForMassageTo(customerName: string): void {
    this.messageToInCustomers = customerName;
    this.messageToInCustomersChange.emit(this.messageToInCustomers);
  }

}
