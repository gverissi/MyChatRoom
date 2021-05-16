import {Message} from '../message/message';

export class Customer {

  name: string;
  connected = false;
  isTyping = false;
  newMessages: Message[] = [];
  channel = '';

  constructor(name: string, connected: boolean) {
    this.name = name;
    this.connected = connected;
  }

}

