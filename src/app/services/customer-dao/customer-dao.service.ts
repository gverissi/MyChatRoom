import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, DocumentChangeAction} from '@angular/fire/firestore';
import {Customer} from '../../entities/customer/customer';
import {Observable} from 'rxjs';
import firebase from 'firebase/app';
import {Message} from '../../entities/message/message';

@Injectable({
  providedIn: 'root'
})
export class CustomerDaoService {

  collectionName = 'customer';
  customerCollection: AngularFirestoreCollection<Customer>;

  constructor(private db: AngularFirestore) {
    this.customerCollection = db.collection<Customer>(this.collectionName);
  }

  save(customer: Customer): Promise<void> {
    const data = { ...customer };
    return this.customerCollection.doc(customer.name).set(data);
  }

  updateConnected(customerName: string, connected$: boolean): Promise<void> {
    const data = { connected: connected$ };
    return this.customerCollection.doc(customerName).update(data);
  }

  updateIsTyping(customerName: string, isTyping$: boolean): Promise<void> {
    const data = { isTyping: isTyping$ };
    return this.customerCollection.doc(customerName).update(data);
  }

  addNewMessage(sender: string, recipient: string, message: Message): void {
    const data = { newMessages: firebase.firestore.FieldValue.arrayUnion({ ...message }) };
    if (recipient === '-') {
      this.customerCollection.get().subscribe(querySnapshot =>
        querySnapshot.docs.forEach(queryDocumentSnapshot => {
          const customer = queryDocumentSnapshot.data();
          if (customer.name !== sender) {
            // @ts-ignore
            this.customerCollection.doc(customer.name).update(data);
          }
        })
      );
    } else {
      // @ts-ignore
      this.customerCollection.doc(recipient).update(data);
    }
  }

  findByName(name: string): Observable<Customer> {
    return this.customerCollection.doc(name).valueChanges();
  }

  findAll(): Observable<Customer[]> {
    return this.customerCollection.valueChanges();
  }

  findAllWhereIsTyping(): Observable<DocumentChangeAction<Customer>[]> {
    return this.db.collection<Customer>(this.collectionName, ref => ref.where('isTyping', '==', true)).snapshotChanges();
  }

}
