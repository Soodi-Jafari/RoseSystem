import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { MRP } from '../models/mrp';
import { BaseService } from 'src/app/services/base.service';
import { GlobalConfigService } from 'src/app/services/global-config.service';

@Injectable()
export class MRPService extends  BaseService<MRP> {
  constructor(private httpClient: HttpClient,private globalConfigService: GlobalConfigService) {
    super( httpClient, globalConfigService );
    this.controllerName = 'MRP';
  }

  public getItemsLookup(): Observable<object> {
    // const urlStr = this.makeUrl('', top.toString());
    let url = `${this.globalConfigService.apiUrl}/api/item/GetItemsLookup`;
    return this.httpClient.get<object>(url);
  }

  public GetMRDocuments(actionName: string = '',  urlParams: string = ''): Observable<object> {
    const urlStr = this.makeApiUrl(actionName,urlParams);
    return this.httpClient.get<object>(urlStr);
  }

/*   public getVendorsLookup( ids : number[]): Observable<object> {
    const  ob = {'ids': ids};
    return this.httpClient.post<object>(this.globalConfigService.apiUrl + '/api/mrp/VendorsLookup', ob);
  } */

  public GetMrp(urlParams: string = ''): Observable<object> {
    const urlStr = this.makeApiUrl('GetSummary',urlParams);
    return this.httpClient.get<object>(urlStr);
  }
}
