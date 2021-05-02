import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  formGroup: FormGroup;

  constructor(public authService: AuthService) {
    this.createForm();
  }

  ngOnInit(): void {
  }

  private createForm(): void {
    this.formGroup = new FormGroup(
      {
        name: new FormControl('', [Validators.required, Validators.min(3)]),
        email: new FormControl('', [Validators.required, Validators.min(6)]),
        password: new FormControl('', [Validators.required, Validators.min(6)])
      });
  }

  nameValidity(): boolean {
    return this.formGroup.controls.name.invalid &&
      (this.formGroup.controls.name.dirty || this.formGroup.controls.name.touched);
  }

  emailValidity(): boolean {
    return this.formGroup.controls.email.invalid &&
      (this.formGroup.controls.email.dirty || this.formGroup.controls.email.touched);
  }

  passwordValidity(): boolean {
    return this.formGroup.controls.password.invalid &&
      (this.formGroup.controls.password.dirty || this.formGroup.controls.password.touched);
  }

  registerNewUser(): void {
    this.authService.register(this.formGroup.value.name, this.formGroup.value.email, this.formGroup.value.password);
  }

}
