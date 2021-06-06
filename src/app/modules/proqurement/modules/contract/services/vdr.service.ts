import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/services/base.service';
import { GlobalConfigService } from 'src/app/services/global-config.service';
import { ApprovalFlow } from 'src/app/models/approval-flow';
import { VDR } from '../models/vdr';

@Injectable()
export class VDRService extends  BaseService<VDR> {
  constructor(private httpClient: HttpClient,private globalConfigService: GlobalConfigService) {
    super( httpClient, globalConfigService );
    this.controllerName = 'vdr';
  }

  public getUserExpertLookup(  urlParams: string = ''): Observable<object> {
    const urlStr = this.globalConfigService.apiUrl + `/api/common/UserExpertDiscipline/${urlParams}`;
    return this.httpClient.get<object>(urlStr);
  }

  public ChangeState(model: ApprovalFlow): Observable<boolean> {
    const url = this.makeApiUrl() + '/changestate';
    return this.httpClient.post<boolean>(url, model);
  }

}
