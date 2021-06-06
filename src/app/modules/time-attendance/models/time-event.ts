import { GuidLookupValue, LookupValue } from 'src/app/models/lookup-value';
import { EventStates } from './event-states';

export class TimeEvent
{
  constructor() {
    this.eventStates = [];
}
    id: number;
    activityId: number;
    taskId: number;
    eventType: number;
    title: string;
    start: Date;
    end: Date;
    currentStatus: number;
    organizationRole: LookupValue;
    description: string;
    dailyVacationType?: number;
    dailyVacationTypeTitle: string;
    transportType?: number;
    project: any;
    ownerName: string;
    creationJalaliDate: string;
    ownerId: number;
    duration: string;
    isAllDay: boolean;
    approvePosition: number;
    comment: string;
    fiscalYear: number;
    eventStates: EventStates[]

}