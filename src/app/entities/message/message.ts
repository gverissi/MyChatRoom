import {Customer} from '../user/customer';
import firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;

export class Message {

  from: Customer;
  body: string;
  date: Timestamp;

  constructor(from: Customer, body: string, date: Timestamp) {
    this.from = from;
    this.body = body;
    this.date = date;
  }

}
