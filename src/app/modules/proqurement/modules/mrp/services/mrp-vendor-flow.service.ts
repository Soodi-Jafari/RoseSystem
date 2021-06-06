import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { MrpVendorFlow } from '../models/mrp-vendor-flow';
import { BaseService } from 'src/app/services/base.service';
import { GlobalConfigService } from 'src/app/services/global-config.service';
import { ApprovalFlow } from 'src/app/models/approval-flow';

@Injectable()
export class MRPVendorFlowService extends  BaseService<MrpVendorFlow> {
  constructor(private httpClient: HttpClient,private globalConfigService: GlobalConfigService) {
    super( httpClient, globalConfigService );
    this.controllerName = 'mrpvendorflow';
  }

  public getListLookup(actionName: string = '',  urlParams: string = ''): Observable<object> {
    // const urlStr = this.makeUrl('', top.toString());
    const urlStr = this.makeApiUrl(actionName,urlParams);
    return this.httpClient.get<object>(urlStr);
  }

  public getUserExpertLookup(  urlParams: string = ''): Observable<object> {
    // const urlStr = this.makeUrl('', top.toString());
    const urlStr = this.globalConfigService.apiUrl + `/api/common/UserExpertDiscipline/${urlParams}`;
    return this.httpClient.get<object>(urlStr);
  }

  public ChangeState(model: ApprovalFlow): Observable<boolean> {
    const url = this.makeApiUrl() + '/changestate';
    return this.httpClient.post<boolean>(url, model);
  }

  public VendorDelay(): Observable<boolean> {
    const url = this.makeApiUrl() + '/vendorDelay';
    return this.httpClient.get<boolean>(url);
  }

/*   public getFlowCartableList(actionName: string = '', model): Observable<object> {
    const urlStr = this.makeApiUrl(actionName);
    return this.httpClient.post<object>(urlStr, model); 
  }*/
}
