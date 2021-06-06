import { LookupValue } from 'src/app/models/lookup-value';

export class VPIS {
    id: number;   
    contractId: number;
    description: number;
    documentNo: string;
    planDate: Date;
    classification: string;
    descipline:LookupValue;
}
