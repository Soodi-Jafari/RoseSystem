import { LookupValue } from 'src/app/models/lookup-value';

export class ContractTermPayment {
    id: number;      
    contractId: number;
    percent: number;
    paymentType: number;
    description: string;  
}
