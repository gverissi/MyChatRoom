import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentChangeAction,
  DocumentReference,
} from '@angular/fire/firestore';
import {Message} from '../../entities/message/message';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageDaoService {

  tableName = 'message';
  table: AngularFirestoreCollection<Message>;

  constructor(private db: AngularFirestore) {
    this.table = db.collection(this.tableName);
  }

  save(message: Message): Promise<DocumentReference<Message>> {
    const data = { from: { name: message.from.name, connected: message.from.connected }, body: message.body , date: message.date };
    return this.table.add(data);
  }

  findAll(): Observable<DocumentChangeAction<Message>[]> {
    return this.table.snapshotChanges();
  }

}
