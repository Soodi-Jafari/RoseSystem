import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { MrpItem } from '../models/mrp-item';
import { BaseService } from 'src/app/services/base.service';
import { GlobalConfigService } from 'src/app/services/global-config.service';

@Injectable()
export class MRPItemService extends  BaseService<MrpItem> {
  constructor(private httpClient: HttpClient,private globalConfigService: GlobalConfigService) {
    super( httpClient, globalConfigService );
    this.controllerName = 'mrpItem';
  }

  public getListLookup(actionName: string = '',  urlParams: string = ''): Observable<object> {
    // const urlStr = this.makeUrl('', top.toString());
    const urlStr = this.makeApiUrl(actionName,urlParams);
    return this.httpClient.get<object>(urlStr);
  }

}
