import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MessageDaoService} from '../../services/message-dao/message-dao.service';
import {Message} from '../../entities/message/message';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

  messageForm: FormGroup;

  constructor(private messageDao: MessageDaoService) {
  }

  ngOnInit(): void {
    this.messageForm = new FormGroup( { body: new FormControl('', Validators.required) });
  }

  onClickSendMessage(): void {
    const customer = JSON.parse(localStorage.getItem('customer'));
    const body = this.messageForm.value.body;
    const message = new Message(customer, body, (new Date()).getTime());
    this.messageDao.save(message).then(
      () => this.messageForm.reset()
    );
  }

}
