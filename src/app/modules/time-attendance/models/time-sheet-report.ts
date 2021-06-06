export class TimeSheetReport
{
    id: number;
    title: string;
    project: string;
    projectId: string;
    activity: string;
    activityDetail: string;
    activityId: number;
    organizationRoleId: number;
    organizationRole: string;
    taskId?: number;
    subject: string;
    startDateJalali: string;
    endDateJalali: string;
    startDate: Date;
    endDate: Date;
    currentStatus: string;
    eventType: number;
    duration: string;
    owner: string;
    ownerId: number;
    personelCode:string;
    lastModifiedUser: string;
    creationDate: Date;
    isAllDay: boolean;
    department: string;
    durationNumber: number;
    statusTitle: string;
    eventTypeTitle: string;
    description: string;
}