import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MessageDaoService} from '../../services/message-dao/message-dao.service';
import {Message} from '../../entities/message/message';
import {Customer} from '../../entities/customer/customer';
import {CustomerDaoService} from '../../services/customer-dao/customer-dao.service';
import {Subscription} from 'rxjs';
import {map} from 'rxjs/operators';

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
  customer: Customer;
  typingCustomers: Customer[] = [];
  subscription: Subscription;

  constructor(private messageDao: MessageDaoService, private customerDao: CustomerDaoService) {
  }

  ngOnInit(): void {
    this.messageForm = new FormGroup({body: new FormControl('', Validators.required)});
    this.customer = JSON.parse(localStorage.getItem('customer'));
    this.subscription = this.customerDao.findAllWhereIsTyping().pipe(
      map(changes => changes.map(c => ({ ...c.payload.doc.data() })))).subscribe(data => {
      this.typingCustomers = data.filter(customer => customer.name !== this.customer.name);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onClickSendMessage(): void {
    this.isTyping = false;
    this.saveCustomer();
    const body = this.messageForm.value.body;
    const message = new Message(this.customer, body, (new Date()).getTime());
    this.messageDao.save(message).then(
      () => this.messageForm.reset()
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
    this.customer.isTyping = this.isTyping;
    this.customerDao.save(this.customer);
  }

}
