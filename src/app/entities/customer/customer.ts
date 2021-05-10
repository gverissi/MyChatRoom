export class Customer {

  name: string;
  connected = false;
  isTyping = false;

  constructor(name: string, connected: boolean) {
    this.name = name;
    this.connected = connected;
  }

}

