import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {GlobalConfigService} from './global-config.service';

/* const httpOptions = {
  headers: new HttpHeaders({
     'Access-Control-Allow-Origin': 'http://localhost:4200'})
}; */

@Injectable()
export abstract class BaseService<T> {
  protected controllerName: string;
  constructor(private http: HttpClient, private globalConfig: GlobalConfigService) {
  }
  public getList(actionName: string = '', urlParams: string = ''): Observable<Array<T>> {
    // const urlStr = this.makeUrl('', top.toString());
    const urlStr = this.makeApiUrl(actionName, urlParams);
    return this.http.get<Array<T>>(urlStr);
  }
  public getListByPost(actionName: string = '', complexObject: object): Observable<Array<T>> {
    const urlStr = this.makeApiUrl(actionName, '');
    return this.http.post<Array<T>>(urlStr, complexObject);
  }
  public getSingle(actionName: string, urlParams: string): Observable<T> {
    const urlStr = this.makeApiUrl(actionName, urlParams);
    return this.http.get<T>(urlStr);
  }
  public Post(model: T): Observable<boolean> {
    const url = this.makeApiUrl() + '/post';
    return this.http.post<boolean>(url, model);
  }

  public Delete(model: T): Observable<boolean> {
    const url = this.makeApiUrl() + `/delete`;
    return this.http.post<boolean>(url, model);
  }
  protected makeApiUrl(actionName: string = '', urlparams: string = ''): string {
  
    let url = `${this.globalConfig.apiUrl}/api/${this.controllerName}`;
    if (actionName !== '') {
      url = `${url}/${actionName}`;
    }
    if (urlparams !== '') {
      url = `${url}/${urlparams}`;
    }
    return url;
  }
}