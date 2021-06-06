import { LookupValue } from 'src/app/models/lookup-value';


export class ProcurementItem {
    id: number;
    title: string;
    code: string;
    decipline: LookupValue;
    unitOfMeasure: LookupValue;    
    description: string;  
}
