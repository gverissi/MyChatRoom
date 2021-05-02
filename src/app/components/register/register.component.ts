import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  formGroup: FormGroup;

  constructor(public authService: AuthService, private router: Router) {
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
    const name = this.formGroup.value.name;
    const email = this.formGroup.value.email;
    const password = this.formGroup.value.password;
    this.authService.register(name, email, password).then(
      () => this.router.navigate(['/log-in']),
      (error) => console.log(error)
    );
  }

}
