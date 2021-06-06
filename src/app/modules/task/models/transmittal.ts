import { GuidLookupValue } from 'src/app/models/lookup-value';
import { TransmittalDocument } from './transmittal-document';

export class Transmittal {

    constructor() {
        this.transmittalDocuments = [];
    }

    id: number;
    customer: GuidLookupValue;
    transmittalDate: Date;
    transmittalNo:string;
    transmittalType: number;
    description: string;  
    creationDate: Date;
    hasDocument: boolean;
    projectId: string;
    isArchived: boolean;
    copiedTransmittalId: number;
    transmittalDocuments: TransmittalDocument[]
}
