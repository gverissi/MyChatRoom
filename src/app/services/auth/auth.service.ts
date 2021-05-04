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

  customer: Customer;

  constructor(private angularFireAuth: AngularFireAuth, private customerDao: CustomerDaoService) {
  }

  getAuthState(): Observable<User> {
    return this.angularFireAuth.authState;
  }

  register(name: string, email: string, password: string): Promise<any> {
    const customer = new Customer(email, name, true);
    return this.angularFireAuth.createUserWithEmailAndPassword(email, password).then(
      () => this.customerDao.save(customer).then(
        () => {
          this.customer = customer;
          localStorage.setItem('customer', JSON.stringify(this.customer));
        }
      )
    );
  }

  logIn(email: string, password: string): Promise<any> {
    return this.angularFireAuth.signInWithEmailAndPassword(email, password).then(
      () => this.customerDao.findByEmail(email).subscribe(
        doc => {
          if (doc.exists) {
            const customer = new Customer(doc.data().email, doc.data().name, true);
            this.customerDao.save(customer).then(
              () => {
                this.customer = customer;
                localStorage.setItem('customer', JSON.stringify(this.customer));
              }
            );
          } else {
            console.log('No such document!');
          }
        }
      )
    );
  }

  logOut(): Promise<any> {
    return this.angularFireAuth.signOut().then(
      () => {
        this.customer.connected = false;
        this.customerDao.save(this.customer).then(
          () => {
            this.customer = null;
            localStorage.setItem('customer', null);
          }
        );
      }
    );
  }

}
