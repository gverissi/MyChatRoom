import {Component, EventEmitter, OnInit} from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  messageToInDashboard = '-';
  messageToInDashboardEventEmitter = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  notifyMessageToChanged($event: string): void {
    this.messageToInDashboard = $event;
    this.messageToInDashboardEventEmitter.emit(this.messageToInDashboard);
  }
}
