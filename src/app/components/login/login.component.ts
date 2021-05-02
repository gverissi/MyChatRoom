import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formGroup: FormGroup;

  constructor(public authService: AuthService) {
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

  logInUser(): void {
    this.authService.logIn(this.formGroup.value.name, this.formGroup.value.email, this.formGroup.value.password);
  }

}
