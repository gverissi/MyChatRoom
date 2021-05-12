import {Component, EventEmitter, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';
import {Customer} from '../../entities/customer/customer';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  messageToInDashboard = '-';
  messageToInDashboardEventEmitter = new EventEmitter<string>();
  customer: Customer = null;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.customerEventEmitter.subscribe(customer => this.customer = customer);
  }

  notifyMessageToChanged($event: string): void {
    this.messageToInDashboard = $event;
    this.messageToInDashboardEventEmitter.emit(this.messageToInDashboard);
  }

}
