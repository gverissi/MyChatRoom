import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MessageDaoService} from '../../services/message-dao/message-dao.service';
import {Message} from '../../entities/message/message';
import {Customer} from '../../entities/customer/customer';
import {CustomerDaoService} from '../../services/customer-dao/customer-dao.service';
import {Observable, Subscription} from 'rxjs';
import {AuthService} from '../../services/auth/auth.service';
import Timeout = NodeJS.Timeout;

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() messageToObservableInMessage: Observable<string>;
  @ViewChild('message') textAreaInputField: ElementRef;

  timeoutDown: Timeout;
  timeoutUp: Timeout;
  isTyping = false;
  typingCustomers: Customer[] = [];
  subscriptionIsTyping: Subscription;
  subscriptionAuth: Subscription;
  subscriptionMessageTo: Subscription;
  customerName: string = null;
  messageTo = '-';
  messageBody = '';

  constructor(private messageDao: MessageDaoService, private customerDao: CustomerDaoService, private authService: AuthService) {
    this.customerName = localStorage.getItem('customerName');
  }

  ngOnInit(): void {
    this.subscriptionAuth = this.authService.getAuthState().subscribe(user => {
      if (user) {
        this.subscriptionIsTyping = this.customerDao.findAllWhereIsTyping().subscribe(customers =>
          this.typingCustomers = customers.filter(customer =>
            customer.name !== this.customerName &&
            (customer.channel === this.messageTo || (customer.channel === this.customerName && customer.name === this.messageTo))
          )
        );
      }
    });
    this.subscriptionMessageTo = this.messageToObservableInMessage.subscribe(to => {
      this.messageTo = to;
      this.textAreaInputField.nativeElement.focus();
    });
  }

  ngAfterViewInit(): void {
    this.textAreaInputField.nativeElement.focus();
  }

  ngOnDestroy(): void {
    this.subscriptionIsTyping.unsubscribe();
    this.subscriptionMessageTo.unsubscribe();
    this.subscriptionAuth.unsubscribe();
  }

  sendMessage(): void {
    const body = this.messageBody.trim();
    if (body !== '') {
      this.isTyping = false;
      this.updateCustomer();
      const message = new Message(this.customerName, body, (new Date()).getTime(), this.messageTo);
      this.messageDao.save(message).then(() => {
        this.messageBody = '';
        this.customerDao.addNewMessage(this.customerName, message.to, message);
      });
    } else {
      this.messageBody = '';
    }
  }

  clearTextArea(): void {
    this.messageBody = '';
  }

  public onKeyDown(): void {
    if (!this.isTyping) {
      this.isTyping = true;
      this.updateCustomer();
    }
  }

  public onKeyUp(): void {
    clearTimeout(this.timeoutUp);
    this.timeoutUp = setTimeout(() => {
      this.isTyping = false;
      this.updateCustomer();
    }, 4000);
  }

  private updateCustomer(): void {
    this.customerDao.updateIsTyping(this.customerName, this.isTyping);
  }

}
