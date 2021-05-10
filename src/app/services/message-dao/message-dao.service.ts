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
    const data = {
      from: message.from,
      body: message.body,
      date: message.date,
      to: message.to
    };
    return this.table.add(data);
  }

  findAll(): Observable<DocumentChangeAction<Message>[]> {
    return this.table.snapshotChanges();
  }

  findAllWhereTo(to: string): Observable<DocumentChangeAction<Message>[]> {
    return this.db.collection<Message>(this.tableName, ref => ref.where('to', '==', to)).snapshotChanges();
  }

}
