import { AttachFile } from 'src/app/models/attach-file';

export class ApprovalFlow {

    constructor() {
        this.flowAttachs = [];
    }
    id: number;
    entityId: number;
    comment: string;   
    flowState : number;
    creationUser : string;
    creationUserId: number;
    expertUser : string;
    expertUserId : number;
    fileDirection: string;
    rev: string;
    flowAttachs : AttachFile[];
}
