import { AttachFile } from 'src/app/models/attach-file';
import { LookupValue } from 'src/app/models/lookup-value';
import { ApprovalFlow } from 'src/app/models/approval-flow';

export class MrpVendorFlow {

    constructor() {
        this.vendorAttachs = [];

    }
    id: number;
    mrpId: number;
    letterNo: string;
    mrpNo: string;
    mrpTitle: string;
    discipline: string;
    projectId: string;
    disciplineId: number;
    parentId : number;
    subject: string;
    vendor: LookupValue;
    letterDate: Date;
    direction: boolean;
    correspondenceType: number;
    vendorFlowStatus: number;
    description : string;
    currentState : number;
    toExpert : LookupValue;
    comment: string;
    deadline: Date;
    creationDate: Date;
    fileDirection: string;
    vendorOffer : VendorOffer
    vendorAttachs : AttachFile[];
    vendorFlowStates : ApprovalFlow[];
}


export class VendorOffer
{
    constructor() {
        this.vendorAttachs = [];
    }
    fileDirection: string;
    deadline: Date;
    vendorAttachs: AttachFile[];
}