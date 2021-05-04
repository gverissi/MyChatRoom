import {Component, OnInit, ViewChild} from '@angular/core';
import {Message} from '../../entities/message/message';
import {MessageDaoService} from '../../services/message-dao/message-dao.service';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  @ViewChild('scroll') scroll: any;

  messages: Message[] = [];

  constructor(private messageDao: MessageDaoService) { }

  ngOnInit(): void {
    this.messageDao.findAll().pipe(
      map(changes => changes.map(c => ({ ...c.payload.doc.data() })))).subscribe(data => {
      this.messages = data.sort((a: Message, b: Message) => a.date.toDate().getTime() - b.date.toDate().getTime());
      this.scroll.nativeElement.scrollTop = this.scroll.nativeElement.scrollHeight;
    });
  }

}
