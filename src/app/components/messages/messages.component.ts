import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Message} from '../../entities/message/message';
import {MessageDaoService} from '../../services/message-dao/message-dao.service';
import {map} from 'rxjs/operators';
import {Observable, Subscription} from 'rxjs';
import {AuthService} from '../../services/auth/auth.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit, OnDestroy {

  @ViewChild('scroll') scroll: any;

  messages: Message[] = [];
  subscription: Subscription;
  subscriptionAuth: Subscription;
  subscriptionMessageTo: Subscription;

  @Input()  messageToObservableInMessages: Observable<string>;
  messageTo = '-';

  constructor(private messageDao: MessageDaoService, private authService: AuthService) { }

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
        this.subscription = this.messageDao.findAllWhereFromTo(user.displayName, this.messageTo).pipe(
          map(changes => changes.map(c => ({ ...c.payload.doc.data() })))).subscribe(data => {
          this.messages = data.sort((a: Message, b: Message) => a.date - b.date);
          this.scroll.nativeElement.scrollTop = this.scroll.nativeElement.scrollHeight;
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe();
    this.subscriptionMessageTo.unsubscribe();
  }

  unsubscribe(): void {
    this.subscription.unsubscribe();
    this.subscriptionAuth.unsubscribe();
  }

  getDate(ts: number): Date {
    return new Date(ts);
  }

}
