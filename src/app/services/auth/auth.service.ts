import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() {
  }

  register(name: string, email: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {});
  }

  logIn(name: string, email: string, password: string): void {

  }

}
