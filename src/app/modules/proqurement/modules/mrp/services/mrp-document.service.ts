import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { MrpDocument } from '../models/mrp-document';
import { BaseService } from 'src/app/services/base.service';
import { GlobalConfigService } from 'src/app/services/global-config.service';

@Injectable()
export class MRPDocumentService extends  BaseService<MrpDocument> {
  constructor(private httpClient: HttpClient,private globalConfigService: GlobalConfigService) {
    super( httpClient, globalConfigService );
    this.controllerName = 'mrpdocument';
  }

  public GetNotMRDocuments(urlParams: string = ''): Observable<object> {
    // const urlStr = this.makeUrl('', top.toString());
    const urlStr = this.makeApiUrl("GetNotMRDocuments",urlParams);
    return this.httpClient.get<object>(urlStr);
  }

  public GetFile(urlParams: string = ''): Observable<object> {
    let url = `${this.globalConfigService.apiUrl}/${urlParams}`;
    return this.httpClient.get<object>(url);
  }
}
