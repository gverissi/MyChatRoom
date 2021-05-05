import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Message} from '../../entities/message/message';
import {MessageDaoService} from '../../services/message-dao/message-dao.service';
import {map} from 'rxjs/operators';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit, OnDestroy {

  @ViewChild('scroll') scroll: any;

  messages: Message[] = [];
  subscription: Subscription;

  constructor(private messageDao: MessageDaoService) { }

  ngOnInit(): void {
    this.subscription = this.messageDao.findAll().pipe(
      map(changes => changes.map(c => ({ ...c.payload.doc.data() })))).subscribe(data => {
      this.messages = data.sort((a: Message, b: Message) => a.date - b.date);
      this.scroll.nativeElement.scrollTop = this.scroll.nativeElement.scrollHeight;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getDate(ts: number): Date {
    return new Date(ts);
  }

}
