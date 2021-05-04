import { Component, OnInit } from '@angular/core';
import {map} from 'rxjs/operators';
import {Customer} from '../../entities/customer/customer';
import {CustomerDaoService} from '../../services/customer-dao/customer-dao.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {

  customers: Customer[] = [];

  constructor(private customerDao: CustomerDaoService) { }

  ngOnInit(): void {
    this.customerDao.findAll().pipe(
      map(changes => changes.map(c => ({ ...c.payload.doc.data() })))).subscribe(data => {
      this.customers = data.sort();
    });
  }

}
