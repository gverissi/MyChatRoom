export class Customer {

  email: string;
  name: string;
  connected = false;
  isTyping = false;

  constructor(email: string, name: string, connected: boolean) {
    this.email = email;
    this.name = name;
    this.connected = connected;
  }

}

