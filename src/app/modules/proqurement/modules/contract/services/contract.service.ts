import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contract } from '../models/contract';
import { BaseService } from 'src/app/services/base.service';
import { GlobalConfigService } from 'src/app/services/global-config.service';
import { LookupValue } from 'src/app/models/lookup-value';

@Injectable()
export class ContractService extends  BaseService<Contract> {
  constructor(private httpClient: HttpClient,private globalConfigService: GlobalConfigService) {
    super( httpClient, globalConfigService );
    this.controllerName = 'Contract';
  }

  public getListLookup(actionName: string = '',  urlParams: string = ''): Observable<object> {
    const urlStr = this.makeApiUrl(actionName,urlParams);
    return this.httpClient.get<object>(urlStr);
  }

  public GetMrps(urlParams: string = ''): Observable<object> {
    let url = `${this.globalConfigService.apiUrl}/api/mrp/GetAll/${urlParams}`;
    return this.httpClient.get<object>(url);
  }

  public GetMrpVendors(urlParams: string = ''): Observable<LookupValue> {
    let url = `${this.globalConfigService.apiUrl}/api/mrpVendor/GetQualifiedMRPVendors/${urlParams}`;
    return this.httpClient.get<LookupValue>(url);
  }

}
