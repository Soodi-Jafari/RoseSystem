import { LookupValue } from 'src/app/models/lookup-value';

export class Contract {
    id: number;
    poNo: string;
    poDate: Date;
    mrpNo:string;
    mrpVendorTitle:string;
    mrp: any;
    projectId: string;
    mrpId: number;
    discipline: string;
    disciplineId: number;
    mrpVendor: LookupValue;
    subject: string;
    effectivenessDate: Date;
    cancelationDate: Date;
    location: boolean;
    duration: number;
    durationUnit: number;
    basePrice: number;
    currencyPrice: number;
    currencyUnit: LookupValue;
    exchangeRate: number;
    itemsBasePrice: number;
    itemCurrencyPrice: number;
    termsOfEffectivness: number;
    installationDate: Date;
    komDate: Date;
    deliveryDate: Date;
    termsOfDelivery:string;
}
