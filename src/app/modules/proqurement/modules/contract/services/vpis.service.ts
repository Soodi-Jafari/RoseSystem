import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/services/base.service';
import { GlobalConfigService } from 'src/app/services/global-config.service';
import { VPIS } from '../models/vpis';

@Injectable()
export class VPISService extends  BaseService<VPIS> {
  constructor(private httpClient: HttpClient,private globalConfigService: GlobalConfigService) {
    super( httpClient, globalConfigService );
    this.controllerName = 'VPIS';
  }

  public getListLookup(actionName: string = '',  urlParams: string = ''): Observable<object> {
    const urlStr = this.makeApiUrl(actionName,urlParams);
    return this.httpClient.get<object>(urlStr);
  }
}
