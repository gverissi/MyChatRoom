import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class IsSignedInGuardService implements CanActivate {

  constructor(private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const isSignedIn = JSON.parse(localStorage.getItem('isCustomerLoggedIn'));
    if (isSignedIn !== true) {
      this.router.navigate(['/home']).then();
    }
    return isSignedIn;
  }

}
