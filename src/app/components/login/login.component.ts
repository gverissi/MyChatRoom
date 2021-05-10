import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userLoginForm: FormGroup;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.createForm();
  }

  private createForm(): void {
    this.userLoginForm = new FormGroup(
      {
        name: new FormControl('', [Validators.required, Validators.minLength(3)]),
        password: new FormControl('', [Validators.required, Validators.minLength(6)])
      });
  }

  nameNotValid(): boolean {
    return (this.userLoginForm.controls.name.invalid &&
      (this.userLoginForm.controls.name.dirty || this.userLoginForm.controls.name.touched));
  }

  passwordValidity(): boolean {
    return this.userLoginForm.controls.password.invalid &&
      (this.userLoginForm.controls.password.dirty || this.userLoginForm.controls.password.touched);
  }

  onClickLogInUser(): void {
    const name = this.userLoginForm.value.name;
    const password = this.userLoginForm.value.password;
    this.authService.logIn(name, password).then(
      () => this.router.navigate(['/dashboard'])
    );
  }

}
