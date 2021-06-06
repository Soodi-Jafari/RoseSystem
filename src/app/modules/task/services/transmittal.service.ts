import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/services/base.service';
import { GlobalConfigService } from 'src/app/services/global-config.service';
import { Transmittal } from '../models/transmittal';
import { LookupValue } from 'src/app/models/lookup-value';

@Injectable()
export class TransmittalService extends  BaseService<Transmittal> {
  filterChange: any;
  constructor(private httpClient: HttpClient,private globalConfigService: GlobalConfigService) {
    super( httpClient, globalConfigService );
    this.controllerName = 'transmittal';
  }

  public getListLookup(urlParams: string = ''): Observable<object> {
    const urlStr = this.makeApiUrl('GetLookups',urlParams);
    return this.httpClient.get<object>(urlStr);
  }

  public getCalculatePCTDocuments(complexObject: object): Observable<object> {
    const urlStr = this.makeApiUrl('CalculatePCTDocuments');
    return this.httpClient.post<object>(urlStr,complexObject);
  }

  public getProjects(): Observable<Array<LookupValue>> {
    const actionStr = `/api/pct/AllProjects`;
    return this.httpClient.get<Array<LookupValue>>(this.globalConfigService.apiUrl + actionStr);
  }

  public getProjectCustomers(urlParams: string = ''): Observable<Array<LookupValue>> {
    const actionStr = `/api/pct/ProjectCustomers/${urlParams}`;
    return this.httpClient.get<Array<LookupValue>>(this.globalConfigService.apiUrl + actionStr);
  }

  public getOrganizationEngineeringManager(): Observable<LookupValue> {
    const urlStr = this.makeApiUrl('OrganizationEngineeringManager');
    return this.httpClient.get<LookupValue>(urlStr);
  }

  public getPrimaveraDocuments(urlParams: string = ''): Observable<Array<object>> {
    const actionStr = `/api/pmdocument/AllDocuments/${urlParams}`;
    return this.httpClient.get<Array<object>>(this.globalConfigService.apiUrl + actionStr);
  }

}
