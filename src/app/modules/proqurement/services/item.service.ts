import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { ProcurementItem } from '../models/procurement-item';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/services/base.service';
import { GlobalConfigService } from 'src/app/services/global-config.service';

@Injectable()

export class ItemService extends  BaseService<ProcurementItem> {
  constructor(private httpClient: HttpClient, globalConfigService: GlobalConfigService) {
    super( httpClient, globalConfigService );
    this.controllerName = 'item';
  }

  public getListLookup(actionName: string = ''): Observable<object> {
    // const urlStr = this.makeUrl('', top.toString());
    const urlStr = this.makeApiUrl(actionName);
    return this.httpClient.get<object>(urlStr);
  }
}