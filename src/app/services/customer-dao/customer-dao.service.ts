import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, DocumentChangeAction} from '@angular/fire/firestore';
import {Customer} from '../../entities/customer/customer';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerDaoService {

  tableName = 'customer';
  table: AngularFirestoreCollection<Customer>;

  constructor(private db: AngularFirestore) {
    this.table = db.collection(this.tableName);
  }

  save(customer: Customer): Promise<void> {
    const data = { ...customer };
    return this.table.doc(customer.name).set(data);
  }

  findAll(): Observable<DocumentChangeAction<Customer>[]> {
    return this.table.snapshotChanges();
  }

  findAllWhereIsTyping(): Observable<DocumentChangeAction<Customer>[]> {
    return this.db.collection<Customer>(this.tableName, ref => ref.where('isTyping', '==', true)).snapshotChanges();
  }

}
