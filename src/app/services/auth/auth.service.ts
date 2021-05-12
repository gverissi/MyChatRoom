import {EventEmitter, Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {Observable, Subscription} from 'rxjs';
import firebase from 'firebase';
import User = firebase.User;
import {CustomerDaoService} from '../customer-dao/customer-dao.service';
import {Customer} from '../../entities/customer/customer';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  mailSuffix = '123@gmail.fr';
  customer: Customer = null;
  subscription: Subscription;
  customerEventEmitter = new EventEmitter<Customer>();

  constructor(private angularFireAuth: AngularFireAuth, private customerDao: CustomerDaoService) {
    this.angularFireAuth.authState.subscribe(user => {
      if (user) {
        this.subscription = this.customerDao.findByName(user.displayName).subscribe(customer => {
          console.log('dans authService: customer = ', customer);
          // if (this.customer === null) {
          //   this.customer = customer;
          // }
          this.customer = customer;
          this.customerEventEmitter.emit(this.customer);
        });
      } else {
        if (this.subscription) {
          this.subscription.unsubscribe();
        }
        this.customer = null;
      }
    });
  }

  getAuthState(): Observable<User> {
    return this.angularFireAuth.authState;
  }

  // register(name: string, password: string): Promise<any> {
  //   const customer = new Customer(name, true);
  //   const email = name + this.mailSuffix;
  //   return this.angularFireAuth.createUserWithEmailAndPassword(email, password).then(
  //     (userCred) => userCred.user.updateProfile({ displayName: name }).then(
  //       () => this.customerDao.save(customer).then(
  //         () => localStorage.setItem('customer', JSON.stringify(customer))
  //       )
  //     )
  //   );
  // }

  register(name: string, password: string): Promise<any> {
    const customer = new Customer(name, true);
    const email = name + this.mailSuffix;
    return this.angularFireAuth.createUserWithEmailAndPassword(email, password).then((userCred) =>
      userCred.user.updateProfile({ displayName: name }).then(() => this.customerDao.save(customer))
    );
  }

  // logIn(name: string, password: string): Promise<any> {
  //   const email = name + this.mailSuffix;
  //   return this.angularFireAuth.signInWithEmailAndPassword(email, password).then(
  //     (userCred) => {
  //       const customer = new Customer(userCred.user.displayName, true);
  //       this.customerDao.save(customer).then(
  //         () => localStorage.setItem('customer', JSON.stringify(customer))
  //       );
  //     }
  //   );
  // }

  logIn(name: string, password: string): Promise<any> {
    const email = name + this.mailSuffix;
    return this.angularFireAuth.signInWithEmailAndPassword(email, password).then((userCred) =>
      this.customerDao.updateConnected(userCred.user.displayName, true)
    );
  }

  // logOut(): Promise<any> {
  //   const customer = JSON.parse(localStorage.getItem('customer'));
  //   customer.connected = false;
  //   localStorage.setItem('customer', null);
  //   return this.customerDao.save(customer).then(
  //     () => this.angularFireAuth.signOut()
  //   );
  // }

  logOut(): Promise<any> {
    return this.customerDao.updateConnected(this.customer.name, false).then(
      () => this.angularFireAuth.signOut()
    );
  }

}
