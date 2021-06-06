import { GuidLookupValue } from 'src/app/models/lookup-value';

export class Timesheet
{
    id: number;
    activityId: number;
    taskId: number;
    eventType: number;
    title: string;
    start: Date;
    end: Date;
    //startTimezone: string;
   // endTimezone: string;
    isAllDay: boolean;
    currentStatus: number;
    projectId: string;
    organizationRoleId: number;
    description: string;
    dailyVacationType?: number;
    transportType?: number;
    fiscalYear: number;
  //  RecurrenceException?: any;
 //   RecurrenceID?: number;
  //  RecurrenceRule?: string;

}