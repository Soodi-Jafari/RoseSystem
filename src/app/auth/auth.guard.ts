import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute, Params, NavigationEnd} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from './auth.service';
import {element} from 'protractor';
import {isNullOrUndefined} from 'util';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authServiece: AuthService, private router: Router) {
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.authServiece.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
