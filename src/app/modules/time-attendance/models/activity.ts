import { LookupValue } from 'src/app/models/lookup-value';

export class Activity
{
    /**
     *
     */
    constructor() {
        this.sections = [];
    }
    id: number;
    title: string;
    code: string;
    activityType: number;
    isProjectize: boolean;
    parentId : number;
    activity: LookupValue;
    isForCunstruction: boolean;
    isForFeasibility: boolean;
    isForProcurement: boolean;
    isForTender: boolean;
    isMain: boolean;
    noneProjectize: boolean;
    sections: LookupValue[];
    description: string;
}