import {Injectable} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {User} from '../models/user';
import {isNullOrUndefined, log} from 'util';
import {catchError, map} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import { GlobalConfigService } from '../services/global-config.service';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable()
export class AuthService {

  private static curUser: User;

  constructor(private cookieService: CookieService,
              private http: HttpClient,
              private globalConfig: GlobalConfigService,
              private userService: UserService,
              private router: Router) {
  }
  login(userName: string, password: string): Observable<Boolean> {
    if (!this.isLoggedIn()) {
      const  ob = {'username': userName, 'password': password};
      return this.http.post<any>(this.globalConfig.apiUrl + '/api/token/post', ob).pipe(
        map(tkn => {
        if (!isNullOrUndefined(tkn)) {
          const expireDate = new Date();
          expireDate.setDate(expireDate.getDate() + 1000);
          this.cookieService.set('trose', tkn,expireDate,'/');
          return true;
        }
        return false;
      }), catchError((err) => {
         return of(false);
      }));
    } else {
      return of(true);
    }
  }
  logout(withNavigate: boolean = true) {

    this.cookieService.delete('trose', '/');
    AuthService.curUser = null;
    this.router.navigate(['/login']);
    /* if(withNavigate) {
      this.router.navigate(['']);
    } */
  }

  getCurrentToken(): string {
    return this.cookieService.get('trose');
  }

  isLoggedIn(): boolean {
    if (!isNullOrUndefined(AuthService.curUser)) {
      return true;
    }
    const uo = this.cookieService.get('trose');
    return !isNullOrUndefined(uo) && uo !== '';
  }

  getLoggedIn(): Observable<User> {
    if (!isNullOrUndefined(AuthService.curUser)) {
      return of(AuthService.curUser);
    }
    const uo = this.cookieService.get('trose');

    if (!isNullOrUndefined(uo) && uo !== '') {
      return this.userService.getCurrentUser().pipe(map(u => {
        AuthService.curUser = u;
        return u;
      }), catchError(error => {
        this.logout(false);
        return of(null);
      }));
    } else {
      AuthService.curUser = null;
      return of(null);
    }
  } 

}
