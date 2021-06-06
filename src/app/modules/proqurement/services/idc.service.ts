import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/services/base.service';
import { GlobalConfigService } from 'src/app/services/global-config.service';
import { Idc, IdcDistribution } from '../models/idc';

@Injectable()

export class IdcService extends  BaseService<Idc> {
  constructor(private httpClient: HttpClient, globalConfigService: GlobalConfigService) {
    super( httpClient, globalConfigService );
    this.controllerName = 'idc';
  }

  public get(actionName: string = '',urlParams: string = ''): Observable<object> {
    const urlStr = this.makeApiUrl(actionName,urlParams);
    return this.httpClient.get<object>(urlStr);
  }

  public ReplyIdc(model: IdcDistribution): Observable<boolean> {
    const url = this.makeApiUrl() + '/ReplyComment';
    return this.httpClient.post<boolean>(url, model);
  }

  public getEntityIdc(actionName: string = '',urlParams: string = ''): Observable<Idc> {
    const urlStr = this.makeApiUrl(actionName, urlParams);
    return this.httpClient.get<Idc>(urlStr);
  }

  public CompleteIdc(model: Idc): Observable<boolean> {
    const url = this.makeApiUrl() + '/CompleteIdc';
    return this.httpClient.post<boolean>(url, model);
  }
}