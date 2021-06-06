import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/services/base.service';
import { GlobalConfigService } from 'src/app/services/global-config.service';
import { ContractGuaranty } from '../models/contract-guaranty';

@Injectable()
export class ContractGuarantyService extends  BaseService<ContractGuaranty> {
  constructor(private httpClient: HttpClient,private globalConfigService: GlobalConfigService) {
    super( httpClient, globalConfigService );
    this.controllerName = 'ContractGuaranty';
  }

  public getContractItems(urlParams: string = ''): Observable<object> {

    const urlStr = this.globalConfigService.apiUrl + `/api/contractItem/allForLookup/${urlParams}`;
    return this.httpClient.get<object>(urlStr);
  }
  
}
