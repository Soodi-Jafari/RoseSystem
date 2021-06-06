import { LookupValue } from 'src/app/models/lookup-value';
import { Customer } from './customer';

export class Project
{
    constructor() {
        this.projectCustomers = [];
    }
    id: number;
    projectName: string;
    projectP3: LookupValue;
    isActive: boolean;
    isFeasibility: boolean;
    inPMISSystem: boolean;
    isTender: boolean;
    projectId: string;
    transmittalName: string;
    revisionPrefix: string;    
    dataCenterPath: string;
    senederLogo: any;
    recieverLogo: any;
    reportProjectTitle: string;
    reportContractNo: string;
    projectCustomers: Customer[];
}