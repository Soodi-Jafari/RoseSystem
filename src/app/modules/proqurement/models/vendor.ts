import { LookupValue } from 'src/app/models/lookup-value';

export class Vendor {
    id: number;
    name: string;
    tel: string;
    webSite: string;
    fax: string;
    email: string;
    vendorManager: string;
    contactName: string;
    address: string;
    shortName:string;

    vendorItems: LookupValue[];
}
