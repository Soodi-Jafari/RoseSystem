import { Injectable } from '@angular/core';
import {HttpInterceptingHandler} from '@angular/common/http/src/module';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import { AuthService } from './auth/auth.service';
import { GlobalConfigService } from './services/global-config.service';

@Injectable()
export class InterceptorService implements HttpInterceptor {

  constructor(private globalConfig: GlobalConfigService, private authServices: AuthService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const Authorization = this.authServices.getCurrentToken();
    const authReq = req.clone({
      headers: req.headers.set('Authorization', Authorization !== null ? 'Bearer ' + Authorization : '')
    });
    // Pass on the cloned request instead of the original request.
    return next.handle(authReq);
  }
}
 