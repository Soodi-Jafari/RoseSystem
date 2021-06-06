import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/services/base.service';
import { GlobalConfigService } from 'src/app/services/global-config.service';
import { TransmittalDocument } from '../models/transmittal-document';
import { Transmittal } from '../models/transmittal';

@Injectable()
export class TransmittalDocumentService extends  BaseService<TransmittalDocument> {
  filterChange: any;
  constructor(private httpClient: HttpClient,private globalConfigService: GlobalConfigService) {
    super( httpClient, globalConfigService );
    this.controllerName = 'transmittalDocument';
  }

  
  public getListLookup(actionName: string = '',  urlParams: string = ''): Observable<object> {
    const urlStr = this.makeApiUrl(actionName,urlParams);
    return this.httpClient.get<object>(urlStr);
  }

  public PostTransmital(model: Transmittal): Observable<boolean> {
    const url = this.makeApiUrl() + '/PostTransmittal';
    return this.httpClient.post<boolean>(url, model);
  }

}
