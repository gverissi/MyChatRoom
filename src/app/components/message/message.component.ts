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
  subscriptionIsTyping: Subscription;
  subscriptionAuth: Subscription;
  subscriptionMessageTo: Subscription;

  @Input() messageToObservableInMessage: Observable<string>;
  customerName: string = null;

  messageTo = '-';

  constructor(private messageDao: MessageDaoService, private customerDao: CustomerDaoService, private authService: AuthService) {
    this.customerName = localStorage.getItem('customerName');
  }

  ngOnInit(): void {
    this.messageForm = new FormGroup({body: new FormControl('', Validators.required)});
    this.subscriptionAuth = this.authService.getAuthState().subscribe(user => {
      if (user) {
        this.subscriptionIsTyping = this.customerDao.findAllWhereIsTyping().pipe(
          map(changes => changes.map(c => ({...c.payload.doc.data()})))).subscribe(data =>
          this.typingCustomers = data.filter(customer => customer.name !== user.displayName)
        );
      }
    });
    this.subscriptionMessageTo = this.messageToObservableInMessage.subscribe(to => this.messageTo = to);
  }

  ngOnDestroy(): void {
    this.subscriptionIsTyping.unsubscribe();
    this.subscriptionMessageTo.unsubscribe();
    this.subscriptionAuth.unsubscribe();
  }

  onClickSendMessage(): void {
    this.isTyping = false;
    this.updateCustomer();
    const body = this.messageForm.value.body;
    const message = new Message(this.customerName, body, (new Date()).getTime(), this.messageTo);
    this.messageDao.save(message).then(() => {
      this.messageForm.reset();
      this.customerDao.addNewMessage(this.customerName, message.to, message);
    });
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
