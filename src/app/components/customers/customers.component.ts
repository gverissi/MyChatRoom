import {Component, OnDestroy, OnInit} from '@angular/core';
import {map} from 'rxjs/operators';
import {Customer} from '../../entities/customer/customer';
import {CustomerDaoService} from '../../services/customer-dao/customer-dao.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit, OnDestroy {

  customers: Customer[] = [];
  subscription: Subscription;

  constructor(private customerDao: CustomerDaoService) { }

  ngOnInit(): void {
    this.subscription = this.customerDao.findAll().pipe(
      map(changes => changes.map(c => ({ ...c.payload.doc.data() })))).subscribe(data => {
      this.customers = data.sort();
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
