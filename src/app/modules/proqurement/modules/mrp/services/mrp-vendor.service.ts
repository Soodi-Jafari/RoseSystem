import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { MrpVendor } from '../models/mrp-vendor';
import { GlobalConfigService } from 'src/app/services/global-config.service';
import { BaseService } from 'src/app/services/base.service';

@Injectable()
export class MRPVendorService extends  BaseService<MrpVendor> {
  constructor(private httpClient: HttpClient,private globalConfigService: GlobalConfigService) {
    super( httpClient, globalConfigService );
    this.controllerName = 'mrpVendor';
  }

/*   public getListLookup(actionName: string = '',  urlParams: string = ''): Observable<object> {
    // const urlStr = this.makeUrl('', top.toString());
    const urlStr = this.makeApiUrl(actionName,urlParams);
    return this.httpClient.get<object>(urlStr);
  } */
  public getVendorsLookup( ids : number[]): Observable<object> {
    const  ob = {'ids': ids};
    return this.httpClient.post<object>(this.globalConfigService.apiUrl + '/api/mrp/VendorsLookup', ob);
  }

}
