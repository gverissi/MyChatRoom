import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MessageDaoService} from '../../services/message-dao/message-dao.service';
import {Message} from '../../entities/message/message';
import {Customer} from '../../entities/customer/customer';
import {CustomerDaoService} from '../../services/customer-dao/customer-dao.service';
import {Observable, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import {AuthService} from '../../services/auth/auth.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit, OnDestroy {

  messageForm: FormGroup;
  timeoutDown: number;
  timeoutUp: number;
  isTyping = false;
  typingCustomers: Customer[] = [];
  subscription: Subscription;
  subscriptionAuth: Subscription;
  subscriptionMessageTo: Subscription;

  @Input()  messageToObservableInMessage: Observable<string>;
  messageTo = '-';

  constructor(private messageDao: MessageDaoService, private customerDao: CustomerDaoService, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.messageForm = new FormGroup({body: new FormControl('', Validators.required)});
    this.subscriptionAuth = this.authService.getAuthState().subscribe(user => {
      if (user) {
        this.subscription = this.customerDao.findAllWhereIsTyping().pipe(
          map(changes => changes.map(c => ({ ...c.payload.doc.data() })))).subscribe(data => {
          this.typingCustomers = data.filter(customer => customer.name !== user.displayName);
        });
        this.subscriptionMessageTo = this.messageToObservableInMessage.subscribe(to => {
          this.messageTo = to;
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptionMessageTo.unsubscribe();
    this.subscription.unsubscribe();
    this.subscriptionAuth.unsubscribe();
  }

  onClickSendMessage(): void {
    this.isTyping = false;
    this.saveCustomer();
    const customer = JSON.parse(localStorage.getItem('customer'));
    const body = this.messageForm.value.body;
    const message = new Message(customer.name, body, (new Date()).getTime(), this.messageTo);
    this.messageDao.save(message).then( () => {
        this.messageForm.reset();
        customer.newMessages.push(message.to);
        console.log('dans message, cust = ', customer);
        this.customerDao.save(customer).then();
      }
    );
  }

  public onKeyDown(): void {
    if (!this.isTyping) {
      this.isTyping = true;
      this.saveCustomer();
    }
  }

  public onKeyUp(): void {
    clearTimeout(this.timeoutUp);
    this.timeoutUp = setTimeout(() => {
      this.isTyping = false;
      this.saveCustomer();
    }, 4000);
  }

  private saveCustomer(): void {
    const customer = JSON.parse(localStorage.getItem('customer'));
    customer.isTyping = this.isTyping;
    this.customerDao.save(customer).then();
  }

}
