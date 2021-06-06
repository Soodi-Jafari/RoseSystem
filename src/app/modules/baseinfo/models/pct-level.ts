import { LookupValue, GuidLookupValue } from 'src/app/models/lookup-value';

export class PCTLevel
{
    constructor() {
        this.conditions = [];
    }

    id: number;
    project: GuidLookupValue;
    customer: GuidLookupValue;
    purposeOfIssue: LookupValue;
    documentClass: string;
    pct: number;
    conditions: PCTCondition[]
}

export class PCTCondition
{
    id: number;
    feild: number;
    conditionOprand: number;
    lookupValue: LookupValue;
    value: string;
    pct: number;
}