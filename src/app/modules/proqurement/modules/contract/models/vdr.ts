import { AttachFile } from 'src/app/models/attach-file';
import { LookupValue } from 'src/app/models/lookup-value';
import { ApprovalFlow } from 'src/app/models/approval-flow';
import { VendorOffer } from '../../mrp/models/mrp-vendor-flow';

export class VDR {

    constructor() {
        this.vendorAttachs = [];
    }
    id: number;
    discipline: string;
    projectId: string;
    disciplineId: number;
    vpis: LookupValue;
    vendor: string;
    purposeOfIssue: string;
    revision: string;
    description : string;
    currentState : number;
    toExpert : LookupValue;
    comment: string;
    vendorOffer : VendorOffer
    creationDate: Date;
    deadline:Date;
    vendorAttachs : AttachFile[];
    vendorFlowStates : ApprovalFlow[];
}

