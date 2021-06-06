import { LookupValue } from 'src/app/models/lookup-value';
import { MrpStatusType } from 'src/app/modules/general/enums/mrp-status-type.enum';

export class MRP {
    id: number;
    title: string;
    mrDocumentId: number;
    disciplineId: number;
    disciplineTitle: string;
    creationDate: Date;
    mrpNo: string;
    wbsmrNo: string;
    planCBEDate: Date;
    planInquiryEnd: Date;
    planInquiryStart: Date;
    planTBEDate: Date;
    statusType: MrpStatusType;
    projectId : string;
    description:string;
    items: LookupValue[];
    vendors: LookupValue[];
}
