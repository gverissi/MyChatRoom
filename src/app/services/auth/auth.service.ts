import {EventEmitter, Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {Observable} from 'rxjs';
import firebase from 'firebase';
import User = firebase.User;
import {UserDaoService} from '../user-dao/user-dao.service';
import {Customer} from '../../entities/user/customer';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // isLoggedIn: boolean;
  customer: Customer;
  customerEmitter: EventEmitter<Customer> = new EventEmitter();

  constructor(private angularFireAuth: AngularFireAuth, private userDao: UserDaoService) {
  }

  getAuthState(): Observable<User> {
    return this.angularFireAuth.authState;
  }

  register(name: string, email: string, password: string): Promise<any> {
    const customer = new Customer(name, true);
    return this.angularFireAuth.createUserWithEmailAndPassword(email, password).then(
      () => this.userDao.save(email, customer).then(
        () => {
          this.customer = customer;
          localStorage.setItem('customer', JSON.stringify(this.customer));
          this.customerEmitter.emit(this.customer);
        }
      )
    );
  }

  logIn(email: string, password: string): Promise<any> {
    return this.angularFireAuth.signInWithEmailAndPassword(email, password).then(
      () => this.userDao.findByEmail(email).subscribe(
        doc => {
          if (doc.exists) {
            console.log('Document data:', doc.data());
            this.customer = new Customer(doc.data().name, doc.data().connected);
            localStorage.setItem('customer', JSON.stringify(this.customer));
            this.customerEmitter.emit(this.customer);
          } else {
            // doc.data() will be undefined in this case
            console.log('No such document!');
          }
        }
      )
    );
  }

  logOut(): Promise<any> {
    return this.angularFireAuth.signOut().then(
      () => {
        this.customer = null;
        localStorage.setItem('customer', null);
        this.customerEmitter.emit(this.customer);
      }
    );
  }

}
