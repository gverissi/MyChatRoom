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

  userRegisterForm: FormGroup;

  constructor(public authService: AuthService, private router: Router) {
    this.createForm();
  }

  ngOnInit(): void {
  }

  private createForm(): void {
    this.userRegisterForm = new FormGroup(
      {
        name: new FormControl('', [Validators.required, Validators.minLength(3)]),
        email: new FormControl('', [Validators.required, Validators.minLength(6)]),
        password: new FormControl('', [Validators.required, Validators.minLength(6)])
      });
  }

  nameNotValid(): boolean {
    return this.userRegisterForm.controls.name.invalid &&
      (this.userRegisterForm.controls.name.dirty || this.userRegisterForm.controls.name.touched);
  }

  emailNotValid(): boolean {
    return this.userRegisterForm.controls.email.invalid &&
      (this.userRegisterForm.controls.email.dirty || this.userRegisterForm.controls.email.touched);
  }

  passwordNotValid(): boolean {
    return this.userRegisterForm.controls.password.invalid &&
      (this.userRegisterForm.controls.password.dirty || this.userRegisterForm.controls.password.touched);
  }

  registerNewUser(): void {
    const name = this.userRegisterForm.value.name;
    const email = this.userRegisterForm.value.email;
    const password = this.userRegisterForm.value.password;
    this.authService.register(name, email, password).then(
      () => this.router.navigate(['/log-in']),
      (error) => console.log(error)
    );
  }

}
