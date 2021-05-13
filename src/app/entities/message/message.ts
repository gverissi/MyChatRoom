
export class Message {

  id: string;
  from: string;
  body: string;
  date: number;
  to: string;

  constructor(fromCustomerName: string, body: string, date: number, toCustomerName: string) {
    this.from = fromCustomerName;
    this.body = body;
    this.date = date;
    this.to = toCustomerName;
  }

}
