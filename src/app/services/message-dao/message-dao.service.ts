import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
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
    this.table = db.collection<Message>(this.tableName);
  }

  save(message: Message): Promise<void> {
    const id = this.db.createId();
    message.id = id;
    const data = { ...message };
    return this.table.doc(id).set(data);
  }

  findAllWhereFromTo(from: string, to: string): Observable<Message[]> {
    if (to === '-') {
      return this.db.collection<Message>(this.tableName, ref => ref.where('to', '==', to)).valueChanges();
    } else {
      const $queryOne = this.db.collection<Message>(this.tableName, ref =>
        ref.where('from', '==', from).where('to', '==', to)).valueChanges();
      const $queryTwo = this.db.collection<Message>(this.tableName, ref =>
        ref.where('from', '==', to).where('to', '==', from)).valueChanges();
      return combineLatest([$queryOne, $queryTwo]).pipe(
        map(([one, two]) => [...one, ...two])
      );
    }
  }

}
