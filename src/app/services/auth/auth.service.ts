import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {Observable} from 'rxjs';
import firebase from 'firebase';
import User = firebase.User;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // isLoggedIn: boolean;

  constructor(private angularFireAuth: AngularFireAuth) {
    // this.angularFireAuth.authState.subscribe(user => {
    //   if (user) {
    //     this.isLoggedIn = true;
    //   } else {
    //     this.isLoggedIn = false;
    //   }
    // });
  }

  getAuthState(): Observable<User> {
    return this.angularFireAuth.authState;
  }

  register(name: string, email: string, password: string): Promise<any> {
    return this.angularFireAuth.createUserWithEmailAndPassword(email, password);
  }

  logIn(email: string, password: string): Promise<any> {
    return this.angularFireAuth.signInWithEmailAndPassword(email, password);
  }

  logOut(): Promise<any> {
    return this.angularFireAuth.signOut();
  }

}
