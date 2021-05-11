
// https://fireship.io/lessons/firestore-cloud-functions-data-aggregation/
export class Customer {

  name: string;
  connected = false;
  isTyping = false;
  newMessages: string[] = [];

  constructor(name: string, connected: boolean) {
    this.name = name;
    this.connected = connected;
  }

}

