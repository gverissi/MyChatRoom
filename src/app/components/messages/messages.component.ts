import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Message} from '../../entities/message/message';
import {MessageDaoService} from '../../services/message-dao/message-dao.service';
import {Observable, Subscription} from 'rxjs';
import {AuthService} from '../../services/auth/auth.service';
import {CustomerDaoService} from '../../services/customer-dao/customer-dao.service';
import {Customer} from '../../entities/customer/customer';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit, OnDestroy {

  @ViewChild('scroll') scroll: any;

  messages: Message[] = [];
  subscriptionMessages: Subscription;
  subscriptionAuth: Subscription;
  subscriptionMessageTo: Subscription;
  subscriptionCustomer: Subscription;

  customerName: string;
  customer: Customer;
  unreadMessages: Message[];

  @Input()  messageToObservableInMessages: Observable<string>;
  messageTo = '-';

  constructor(private messageDao: MessageDaoService, private authService: AuthService, private customerDao: CustomerDaoService) {
    this.customerName = localStorage.getItem('customerName');
  }

  ngOnInit(): void {
    this.subscribe();
    this.subscriptionMessageTo = this.messageToObservableInMessages.subscribe((to) => {
      this.messageTo = to;
      this.unsubscribe();
      this.subscribe();
    });
  }

  subscribe(): void {
    this.subscriptionAuth = this.authService.getAuthState().subscribe(user => {
      if (user) {
        this.subscriptionMessages = this.messageDao.findAllWhereFromTo(this.customerName, this.messageTo).subscribe(messages => {
          this.messages = messages.sort((a: Message, b: Message) => a.date - b.date);
          this.scroll.nativeElement.scrollTop = this.scroll.nativeElement.scrollHeight;
        });
        this.subscriptionCustomer = this.customerDao.findByName(this.customerName).subscribe(customer => {
          this.customer = customer;
          this.unreadMessages = this.customer.newMessages;
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe();
    this.subscriptionMessageTo.unsubscribe();
  }

  unsubscribe(): void {
    this.subscriptionCustomer.unsubscribe();
    this.subscriptionMessages.unsubscribe();
    this.subscriptionAuth.unsubscribe();
  }

  getDate(ts: number): Date {
    return new Date(ts);
  }

  unreadMessageContains(message: Message): boolean {
    if (this.unreadMessages) {
      return this.unreadMessages.some(unreadMessage => unreadMessage.id === message.id);
    } else {
      return false;
    }
  }

  mouseEnter(message: Message): void {
    if (this.unreadMessageContains(message)) {
      this.customerDao.removeNewMessage(this.customer.name, message);
    }
  }
}
