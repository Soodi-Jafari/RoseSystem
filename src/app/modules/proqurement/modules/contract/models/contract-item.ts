import { LookupValue } from 'src/app/models/lookup-value';

export class ContractItem {
    id: number;   
    mrpItem: LookupValue;
    contractId: number;
    quantity: number;
    tagNo: string;
    description: string;
    basePrice: number;
    currencyPrice: number;
    currencyUnit: LookupValue;
    exchangeRate: number;
    termsOfDelivery:string;
    installationDate: Date;
}
