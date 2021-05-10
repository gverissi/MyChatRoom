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

  mailSuffix = '123@gmail.fr';

  constructor(private angularFireAuth: AngularFireAuth, private customerDao: CustomerDaoService) {
  }

  getAuthState(): Observable<User> {
    return this.angularFireAuth.authState;
  }

  register(name: string, password: string): Promise<any> {
    const customer = new Customer(name, true);
    const email = name + this.mailSuffix;
    return this.angularFireAuth.createUserWithEmailAndPassword(email, password).then(
      (userCred) => userCred.user.updateProfile({ displayName: name }).then(
        () => this.customerDao.save(customer).then(
          () => localStorage.setItem('customer', JSON.stringify(customer))
        )
      )
    );
  }

  logIn(name: string, password: string): Promise<any> {
    const email = name + this.mailSuffix;
    return this.angularFireAuth.signInWithEmailAndPassword(email, password).then(
      (userCred) => {
        const customer = new Customer(userCred.user.displayName, true);
        this.customerDao.save(customer).then(
          () => localStorage.setItem('customer', JSON.stringify(customer))
        );
      }
    );
  }

  logOut(): Promise<any> {
    const customer = JSON.parse(localStorage.getItem('customer'));
    customer.connected = false;
    localStorage.setItem('customer', null);
    return this.customerDao.save(customer).then(
      () => this.angularFireAuth.signOut()
    );
  }

}
