import { GuidLookupValue } from 'src/app/models/lookup-value';

export class Customer
{
    id: number;
    customerName: string;
    customerType : GuidLookupValue;
    contactName: string;
    address: string;
    tel: string;
    fax: string;
    customerId: string;
}