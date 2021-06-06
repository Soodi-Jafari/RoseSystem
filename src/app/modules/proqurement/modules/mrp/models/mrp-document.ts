import { GuidLookupValue } from 'src/app/models/lookup-value';
import { AttachFile } from 'src/app/models/attach-file';

export class MrpDocument {

    constructor() {
     this.documentAttachs = [];    
    }

    id: number;
    mrpId: number;
    document: GuidLookupValue;
    documentAttachs : AttachFile[];
}
