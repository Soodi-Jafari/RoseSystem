import { LookupValue } from 'src/app/models/lookup-value';

export class ContractGuaranty {
    id: number;   
    contractItem: LookupValue;
    description: string;
    startDate: Date;
    endDate: Date;
    guarantyType: string;
    isAPG: boolean;
    isPG:boolean;
}
