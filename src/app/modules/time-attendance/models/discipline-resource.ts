import { LookupValue } from 'src/app/models/lookup-value';

export class DisciplineResource
{
    constructor() {
    }
    id: number;
    disciplineTitle: string;
    disciplineId: number;
    projectId: number;
    availableResources: number;
    startDate: Date;
    endDate : Date;  
}