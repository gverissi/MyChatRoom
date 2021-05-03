import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Customer} from '../../entities/user/customer';
import {Observable} from 'rxjs';
import firebase from 'firebase';
import DocumentSnapshot = firebase.firestore.DocumentSnapshot;

@Injectable({
  providedIn: 'root'
})
export class UserDaoService {

  tableName = 'user';
  table: AngularFirestoreCollection<Customer>;

  constructor(private db: AngularFirestore) {
    this.table = db.collection<Customer>(this.tableName);
  }

  save(email: string, user: Customer): Promise<void> {
    const data = { name: user.name, connected: user.connected };
    // const data = userConverter.toFirestore(user);
    // this.table.doc(email).set(user).then(() => console.log('Add person into db')).catch(error => console.log(error.message));
    return this.table.doc(email).set(data);
  }

  findByEmail(email: string): Observable<DocumentSnapshot<Customer>> {
    return this.table.doc(email).get();
  }

}
