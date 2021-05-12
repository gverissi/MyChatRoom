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

  private mailSuffix = '123@gmail.fr';
  private subscription: Subscription;
  public customerEventEmitter = new EventEmitter<Customer>();

  constructor(private angularFireAuth: AngularFireAuth, private customerDao: CustomerDaoService) {
    this.angularFireAuth.authState.subscribe(user => {
      if (user) {
        this.subscription = this.customerDao.findByName(user.displayName).subscribe(customer => {
          this.customerEventEmitter.emit(customer);
          localStorage.setItem('customerName', customer.name);
          localStorage.setItem('isCustomerLoggedIn', JSON.stringify(true));
        });
      } else {
        if (this.subscription) {
          this.subscription.unsubscribe();
        }
        this.customerEventEmitter.emit(null);
        localStorage.setItem('customerName', JSON.stringify(null));
        localStorage.setItem('isCustomerLoggedIn', JSON.stringify(false));
      }
    });
  }

  public getAuthState(): Observable<User> {
    return this.angularFireAuth.authState;
  }

  public register(name: string, password: string): Promise<string | void> {
    const customer = new Customer(name, true);
    const email = name + this.mailSuffix;
    return this.angularFireAuth.createUserWithEmailAndPassword(email, password).then((userCred) =>
      userCred.user.updateProfile({ displayName: name }).then(() => this.customerDao.save(customer))
    );
  }

  public logIn(name: string, password: string): Promise<string | void> {
    const email = name + this.mailSuffix;
    return this.angularFireAuth.signInWithEmailAndPassword(email, password).then((userCred) =>
      this.customerDao.updateConnected(userCred.user.displayName, true)
    );
  }

  public logOut(): Promise<string | void> {
    const customerName = localStorage.getItem('customerName');
    return this.customerDao.updateConnected(customerName, false).then(
      () => this.angularFireAuth.signOut()
    );
  }

}
