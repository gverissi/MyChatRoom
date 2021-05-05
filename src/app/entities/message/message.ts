import {Customer} from '../customer/customer';

export class Message {

  from: Customer;
  body: string;
  date: number;

  constructor(from: Customer, body: string, date: number) {
    this.from = from;
    this.body = body;
    this.date = date;
  }

}
