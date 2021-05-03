import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth/auth.service';
import {Customer} from '../../entities/user/customer';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userLoginForm: FormGroup;
  customer: Customer;
  compeur = 0;

  constructor(public authService: AuthService) {
    // this.compeur = 0;
    console.log('login construcor');
  }

  ngOnInit(): void {
    console.log('login ngOnInit()');
    this.compeur++;
    this.createForm();
    // this.customer = JSON.parse(localStorage.getItem('customer'));
    // this.customer = this.authService.customer;
    // this.authService.customerEmitter.subscribe((customer) => this.customer = customer);
    this.authService.customerEmitter.subscribe((customer) => this.customer = JSON.parse(localStorage.getItem('customer')));
  }

  private createForm(): void {
    this.userLoginForm = new FormGroup(
      {
        email: new FormControl('', [Validators.required, Validators.minLength(6)]),
        password: new FormControl('', [Validators.required, Validators.minLength(6)])
      });
  }

  emailNotValid(): boolean {
    return (this.userLoginForm.controls.email.invalid &&
      (this.userLoginForm.controls.email.dirty || this.userLoginForm.controls.email.touched));
  }

  passwordValidity(): boolean {
    return this.userLoginForm.controls.password.invalid &&
      (this.userLoginForm.controls.password.dirty || this.userLoginForm.controls.password.touched);
  }

  onClickLogInUser(): void {
    const email = this.userLoginForm.value.email;
    const password = this.userLoginForm.value.password;
    this.authService.logIn(email, password).then(
      value => console.log('value on login = ', value),
      reason => console.log('reason = ', reason)
    );
  }

}
