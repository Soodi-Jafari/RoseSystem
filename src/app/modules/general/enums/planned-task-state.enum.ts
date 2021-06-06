export enum PlannedTaskState 
{
    Created= 0,
    WaitPSL = 1,
    InprogressExpert = 2,
    RejectedByPSL = 3,
    WaitingForQA = 4,
    RejectedByQA = 5,
    WaitingForPMApproval = 6,
    RejectedByPM = 7,
    WaitingForEMApproval = 8,
    RejectedByEM = 9,
    WaitDCC = 10,
    RejectedByDCC = 11,
    Completed = 12,
    Canceled = 13,
}