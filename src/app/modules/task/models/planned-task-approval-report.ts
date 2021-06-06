import { LookupValue } from 'src/app/models/lookup-value';
import { AttachFile } from 'src/app/models/attach-file';
import { ApprovalFlow } from 'src/app/models/approval-flow';

export class PlannedTaskApprovalReport {

    constructor() {
    }

    id: number;    
    documentNo: string;
    documentTitle: string;
    comment: string;
    revision: string;
    flowState: number;
    disciplineName: string;
    creationDate: Date;
    creationUser: string;
    taskId: number;
}
