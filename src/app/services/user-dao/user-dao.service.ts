import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {User} from '../../entities/user/user';
import {Observable} from 'rxjs';
import firebase from 'firebase';
import DocumentSnapshot = firebase.firestore.DocumentSnapshot;

@Injectable({
  providedIn: 'root'
})
export class UserDaoService {

  tableName = 'user';
  table: AngularFirestoreCollection<User>;

  constructor(private db: AngularFirestore) {
    this.table = db.collection<User>(this.tableName);
  }

  save(email: string, user: User): Promise<void> {
    const data = { name: user.name, connected: user.connected };
    // const data = userConverter.toFirestore(user);
    // this.table.doc(email).set(user).then(() => console.log('Add person into db')).catch(error => console.log(error.message));
    return this.table.doc(email).set(data);
  }

  findByEmail(email: string): Observable<DocumentSnapshot<User>> {
    return this.db.collection<User>(this.tableName).doc(email).get();
  }

}
