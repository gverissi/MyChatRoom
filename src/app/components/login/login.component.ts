import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userLoginForm: FormGroup;

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    this.createForm();
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
