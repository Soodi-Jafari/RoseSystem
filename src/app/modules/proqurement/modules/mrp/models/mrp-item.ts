import { LookupValue } from 'src/app/models/lookup-value';

export class MrpItem {
    id: number;
    item: LookupValue;
    mrpId: number;
    contigency: number;
    estUnitPrice : number;
    quantity : number;
    estCurrency : LookupValue;
    estWeight : number;
    tagNo : string;
    description : string
}
