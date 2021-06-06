import { AttachFile } from 'src/app/models/attach-file';
import { LookupValue } from 'src/app/models/lookup-value';

export class Idc {

    constructor() {
        this.distributions = [];
        this.fileAttachs = [];   
    }

    id: number;
    entityId: number;
    entityType: number;
    projectId: string;
    desciplineId: number;
    desciplineName: string;
    vendor: string;
    dueDate: Date;
    documentTitle: string;
    documentNo: string;
    creationDate: Date;
    creationUser: string;
    creationUserId: number;
    description: string;
    status: number;
    fileDirection: string;
    fileAttachs: AttachFile[];
    distributions: IdcDistribution[]
}

export class IdcDistribution {
    id: number;
    idcId: number;
    discipline: LookupValue;
    responseStatus: number;
    dueDate: Date;
    comment: string;
    replyComment: string;
    creationUser: string;
    filePath: string;
    fileName: string;
    isCompleted: boolean;
    creationDate: Date;
    lastModifiedDate: Date;
    modifiedUser: string; 
}