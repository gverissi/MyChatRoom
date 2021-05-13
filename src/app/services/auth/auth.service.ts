import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {Observable} from 'rxjs';
import firebase from 'firebase';
import User = firebase.User;
import {CustomerDaoService} from '../customer-dao/customer-dao.service';
import {Customer} from '../../entities/customer/customer';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private emailSuffix = '123@gmail.fr';

  constructor(private angularFireAuth: AngularFireAuth, private customerDao: CustomerDaoService) {
    this.angularFireAuth.authState.subscribe(user => {
      if (user) {
        localStorage.setItem('customerName', user.email.slice(0, -this.emailSuffix.length));
        localStorage.setItem('isCustomerLoggedIn', JSON.stringify(true));
      } else {
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
    const email = name + this.emailSuffix;
    return this.angularFireAuth.createUserWithEmailAndPassword(email, password).then(
      (userCred) =>
        userCred.user.updateProfile({ displayName: name }).then(() =>
          this.customerDao.save(customer)
        ),
      (error) => {
        console.log('Error during registration: ', error);
        localStorage.setItem('customerName', JSON.stringify(null));
      }
    );
  }

  public logIn(name: string, password: string): Promise<string | void> {
    const email = name + this.emailSuffix;
    return this.angularFireAuth.signInWithEmailAndPassword(email, password).then(() =>
      this.customerDao.updateConnected(name, true)
    );
  }

  public logOut(): Promise<string | void> {
    const customerName = localStorage.getItem('customerName');
    return this.customerDao.updateConnected(customerName, false).then(
      () => this.angularFireAuth.signOut()
    );
  }

}
