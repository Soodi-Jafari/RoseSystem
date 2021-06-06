import { LookupValue } from 'src/app/models/lookup-value';
import { AttachFile } from 'src/app/models/attach-file';
import { ApprovalFlow } from 'src/app/models/approval-flow';

export class PlannedTask {

    constructor() {
        this.fileAttachs = [];
        this.approvalStates = [];
    }

    id: number;    
    parentId: number;
    documentNo: string;
    documentTitle: string;
    description: string;
    revision: string;
    fileDirection: string;
    currentState: number;
    disciplineName: string;
    disciplineId: number;
    projectId: string; 
    dueDate: Date;
    priority: LookupValue;
    startDate: Date;   
    creationDate: Date;
    actualStart : Date;
    actualFinish : Date;
    taskType : number;
    creationUser: string;
    progressPercent: number;
    fileAttachs: AttachFile[];
    approvalStates: ApprovalFlow[];
    transmittalId: number;
    sheetNo: number;
    purposeOfIssue: LookupValue;
    lastModifiedUser: string;
    lastModifiedDate: Date;
    autoArchive: boolean;
    estimateManHour: number;
}
