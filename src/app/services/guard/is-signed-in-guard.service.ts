import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';
import {AuthService} from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class IsSignedInGuardService implements CanActivate {

  constructor(private router: Router, private angularFireAuth: AngularFireAuth, private authService: AuthService) { }

  // canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
  //   const user = this.angularFireAuth.currentUser;
  //   console.log('das guard, user = ', user);
  //   const isSignedIn = !!user;
  //   if (isSignedIn !== true) {
  //     this.router.navigate(['/home']).then();
  //   }
  //   return isSignedIn;
  // }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const customer = this.authService.customer;
    const isSignedIn = customer != null;
    if (isSignedIn !== true) {
      this.router.navigate(['/home']).then();
    }
    return isSignedIn;
  }

}
