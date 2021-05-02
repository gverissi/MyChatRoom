import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formGroup: FormGroup;

  constructor(private authService: AuthService) {
    this.createForm();
  }

  ngOnInit(): void {
  }

  private createForm(): void {
    this.formGroup = new FormGroup(
      {
        email: new FormControl('', [Validators.required, Validators.min(6)]),
        password: new FormControl('', [Validators.required, Validators.min(6)])
      });
  }

  emailValidity(): boolean {
    return this.formGroup.controls.email.invalid &&
      (this.formGroup.controls.email.dirty || this.formGroup.controls.email.touched);
  }

  passwordValidity(): boolean {
    return this.formGroup.controls.password.invalid &&
      (this.formGroup.controls.password.dirty || this.formGroup.controls.password.touched);
  }

  onClickLogInUser(): void {
    const email = this.formGroup.value.email;
    const password = this.formGroup.value.password;
    this.authService.logIn(email, password).then(
      value => console.log('value = ', value),
      reason => console.log('reason = ', reason)
    );
  }

}
