import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Customer} from '../../entities/customer/customer';
import {Observable} from 'rxjs';
import firebase from 'firebase';
import DocumentSnapshot = firebase.firestore.DocumentSnapshot;

@Injectable({
  providedIn: 'root'
})
export class CustomerDaoService {

  tableName = 'customer';
  table: AngularFirestoreCollection<Customer>;

  constructor(private db: AngularFirestore) {
    this.table = db.collection<Customer>(this.tableName);
  }

  save(customer: Customer): Promise<void> {
    const data = { email: customer.email,  name: customer.name, connected: customer.connected };
    return this.table.doc(customer.email).set(data);
  }

  findByEmail(email: string): Observable<DocumentSnapshot<Customer>> {
    return this.table.doc(email).get();
  }

}
