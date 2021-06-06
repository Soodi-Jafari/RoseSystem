import { LookupValue } from 'src/app/models/lookup-value';

export class CBE 
{
    constructor() {
        this.cbePricings = [];
    }
    id: number;
    cbeNo : string;
    cbeDate : Date;
    fileName: string;
    filePath : string;
    fileSize : number;
    mrpId: number;
    cbePricings : CBEPricing[]
}

export class CBEPricing
{
    id: number;
    mrpVendorId : number;
    description: string;
    vendorName: string;
    basePrice : number;
    currencyPrice: number;
   // currencyUnitId: number;
    currencyUnit: LookupValue;

}