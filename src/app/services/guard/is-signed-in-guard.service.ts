import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class IsSignedInGuardService implements CanActivate {

  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const customer = JSON.parse(localStorage.getItem('customer'));
    const isSignedIn = !!customer;
    if (isSignedIn !== true) {
      this.router.navigate(['/home']);
    }
    return isSignedIn;
  }

}
