import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/services/base.service';
import { GlobalConfigService } from 'src/app/services/global-config.service';
import { VendorTransmittalDoc } from '../models/vendor-transmittal-doc';

@Injectable()
export class VendorTransmittalDocService extends  BaseService<VendorTransmittalDoc> {
  constructor(private httpClient: HttpClient,private globalConfigService: GlobalConfigService) {
    super( httpClient, globalConfigService );
    this.controllerName = 'vendorTransmittalDoc';
  }

   public getListLookup(actionName: string = '',  urlParams: string = ''): Observable<object> {
    const urlStr = this.makeApiUrl(actionName,urlParams);
    return this.httpClient.get<object>(urlStr);
  }
/*
  public GetMrps(urlParams: string = ''): Observable<object> {
    let url = `${this.globalConfigService.apiUrl}/api/mrp/GetAll/${urlParams}`;
    return this.httpClient.get<object>(url);
  }

  public GetMrpVendors(urlParams: string = ''): Observable<LookupValue> {
    let url = `${this.globalConfigService.apiUrl}/api/mrpVendor/GetQualifiedMRPVendors/${urlParams}`;
    return this.httpClient.get<LookupValue>(url);
  }
 */
}
