import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TBE } from '../models/tbe';
import { GlobalConfigService } from 'src/app/services/global-config.service';
import { BaseService } from 'src/app/services/base.service';

@Injectable()
export class TBEService extends  BaseService<TBE> {
  constructor(private httpClient: HttpClient,private globalConfigService: GlobalConfigService) {
    super( httpClient, globalConfigService );
    this.controllerName = 'tbe';
  }

  public getListLookup(actionName: string = '',  urlParams: string = ''): Observable<object> {
    // const urlStr = this.makeUrl('', top.toString());
    const urlStr = this.makeApiUrl(actionName,urlParams);
    return this.httpClient.get<object>(urlStr);
  }

}
