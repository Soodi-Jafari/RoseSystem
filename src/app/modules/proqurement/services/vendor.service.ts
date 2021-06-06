import { Injectable } from '@angular/core';
import {Vendor} from '../models/vendor';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/services/base.service';
import { GlobalConfigService } from 'src/app/services/global-config.service';

@Injectable()
export class VendorService extends  BaseService<Vendor> {
  constructor(private httpClient: HttpClient,private globalConfigService: GlobalConfigService) {
    super( httpClient, globalConfigService );
    this.controllerName = 'vendor';
  }

  public getItemsLookup(): Observable<object> {
    // const urlStr = this.makeUrl('', top.toString());
    let url = `${this.globalConfigService.apiUrl}/api/item/GetItemsLookup`;
    return this.httpClient.get<object>(url);
  }
}
