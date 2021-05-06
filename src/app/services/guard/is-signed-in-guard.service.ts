import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class IsSignedInGuardService implements CanActivate {

  constructor(private router: Router, private angularFireAuth: AngularFireAuth) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const user = this.angularFireAuth.currentUser;
    const isSignedIn = !!user;
    if (isSignedIn !== true) {
      this.router.navigate(['/home']).then();
    }
    return isSignedIn;
  }

}
