export enum VendorFlowState 
{
    WaitPSL = 0,
    InprogressExpert = 1,
    WaitingForPSLApproval = 2,
    WaitingForPMApproval = 3,
    RejectedByPM = 4,
    WaitingForEMApproval = 5,
    RejectedByEM = 6,
    ApprovedByEM = 7,
    PostedToVendor = 8,
    RejectedByPSL = 9
}