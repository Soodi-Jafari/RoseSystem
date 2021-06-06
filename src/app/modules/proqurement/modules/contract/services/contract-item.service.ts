import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/services/base.service';
import { GlobalConfigService } from 'src/app/services/global-config.service';
import { ContractItem } from '../models/contract-item';

@Injectable()
export class ContractItemService extends  BaseService<ContractItem> {
  constructor(private httpClient: HttpClient,private globalConfigService: GlobalConfigService) {
    super( httpClient, globalConfigService );
    this.controllerName = 'ContractItem';
  }

  public getListLookup(actionName: string = '',  urlParams: string = ''): Observable<object> {
    const urlStr = this.makeApiUrl(actionName,urlParams);
    return this.httpClient.get<object>(urlStr);
  }
  
}
