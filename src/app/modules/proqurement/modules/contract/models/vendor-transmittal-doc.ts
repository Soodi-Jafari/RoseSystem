import { LookupValue } from 'src/app/models/lookup-value';
import { AttachFile } from 'src/app/models/attach-file';

export class VendorTransmittalDoc {

    constructor() {
        this.fileAttachs = [];
    }

    id: number;
    vendorTransmittalId: number;
    vpis: LookupValue;
    sheetNo: number;
    revision: string;
    fileDirection: string;
    currentState: number;
    deadline: Date;
    purposeOfIssue: LookupValue;
    description: string;
    fileAttachs: AttachFile[];
}
