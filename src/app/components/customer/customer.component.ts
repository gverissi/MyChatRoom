import { Component, Input, OnInit } from '@angular/core';
import {Customer} from '../../entities/customer/customer';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  @Input()
  customer: Customer;

  constructor() { }

  ngOnInit(): void {
  }

}
