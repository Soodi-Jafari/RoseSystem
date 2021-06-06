import {User, ChangePassUser} from '../models/user';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { GlobalConfigService } from './global-config.service';

@Injectable()
export class UserService {


  constructor (private http: HttpClient, private globalConfig: GlobalConfigService) {
  }

/*   login(userName: string, password: string)  {
    const  ob = {'uid': userName, 'pass': password};
    alert(this.globalConfig.apiUrl + '/api/member/login');
    return this.http.post<User>(this.globalConfig.apiUrl + '/api/member/login', ob);
  } */
   getCurrentUser(): Observable<User>  {
    const str = this.globalConfig.apiUrl + '/api/token/GetLoggedUser';
    return this.http.get<User>(str);
  } 

  changePassword(userName: string, oldPassword: string,newPassword: string)  {
    const  ob = {'username': userName, 'oldPassword': oldPassword, 'newPassword': newPassword};
    return this.http.post<ChangePassUser>(this.globalConfig.apiUrl + '/api/user/ChangePassword', ob);
  } 
  
}
