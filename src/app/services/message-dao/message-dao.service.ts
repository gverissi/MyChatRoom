import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentChangeAction,
  DocumentReference,
} from '@angular/fire/firestore';
import {Message} from '../../entities/message/message';
import {combineLatest, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

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

  findAllWhereFromTo(from: string, to: string): Observable<DocumentChangeAction<Message>[]> {
    if (to === '-') {
      return this.db.collection<Message>(this.tableName, ref => ref.where('to', '==', to)).snapshotChanges();
    } else {
      const $queryOne = this.db.collection<Message>(this.tableName, ref =>
        ref.where('from', '==', from).where('to', '==', to)).snapshotChanges();
      const $queryTwo = this.db.collection<Message>(this.tableName, ref =>
        ref.where('from', '==', to).where('to', '==', from)).snapshotChanges();
      return combineLatest([$queryOne, $queryTwo]).pipe(
        map(([one, two]) => [...one, ...two])
      );
    }
  }

}
