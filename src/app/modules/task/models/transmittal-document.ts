import { LookupValue } from 'src/app/models/lookup-value';
import { AttachFile } from 'src/app/models/attach-file';
import { Transmittal } from './transmittal';

export class TransmittalDocument {

    constructor() {
        this.fileAttachs = [];
    }

    id: number;
    taskId: number;
    transmittal: Transmittal;
    parentId : number;
    projectId : string;
    disciplineId : number;
    disciplineName : string;
    documentNo : string;
    documentTitle : string;
    sheetNo: number;
    pageType: number;
    revision: string;
    fileDirection: string;
    purposeOfIssue: LookupValue;
    description: string;
    creationDate: Date;
    fileAttachs: AttachFile[];
}
