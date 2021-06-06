import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/services/base.service';
import { GlobalConfigService } from 'src/app/services/global-config.service';
import { ContractTermPayment } from '../models/contract-term-payment';

@Injectable()
export class ContractTermPaymentService extends  BaseService<ContractTermPayment> {
  constructor(private httpClient: HttpClient,private globalConfigService: GlobalConfigService) {
    super( httpClient, globalConfigService );
    this.controllerName = 'ContractTermPayment';
  }

 
}
