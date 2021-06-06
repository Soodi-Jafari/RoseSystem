
export class EnumCoding {
  public static vendorFlowStates = [
    {
      id: 0,
      title: "Wait On PSL"
    },
    {
      id: 1,
      title: "Inprogress (Expert)"
    },
    {
      id: 2,
      title: "Waiting PSL.Approval"
    },
    {
      id: 3,
      title: "Wait on Area Manager"
    },
    {
      id: 4,
      title: "Rejected By Area Manager"
    },
    {
      id: 5,
      title: "Wait On Engineering Manager"
    },
    {
      id: 6,
      title: "Rejected By Engineering Manager"
    },
    {
      id: 7,
      title: "Wait On Coordinator"
    },
    {
      id: 8,
      title: "Posted To Vendor"
    },
    {
      id: 9,
      title: "Rejected By PSL"
    }
  ];


  public static vendorFlowActions = [
    {
      id: 0,
      title: "Coordinator Submit"
    },
    {
      id: 1,
      title: "To Expert"
    },
    {
      id: 2,
      title: "Expert Submit"
    },
    {
      id: 3,
      title: "PSL Approved"
    },
    {
      id: 4,
      title: "Area Manager Rejected "
    },
    {
      id: 5,
      title: "Area Manager Approved"
    },
    {
      id: 6,
      title: "Engineering Mng Rejected"
    },
    {
      id: 7,
      title: "Engineering Mng Approved"
    },
    {
      id: 8,
      title: "Posted To Vendor"
    },
    {
      id: 9,
      title: "PSL Rejected"
    }
  ];
  public static correspondenceTypes = [
    {
      id: 1,
      title: "OF"
    },
    {
      id: 2,
      title: "TC"
    },
    {
      id: 3,
      title: "RFQ"
    },
    {
      id: 4,
      title: "CB"
    },
    {
      id: 5,
      title: "TBE"
    },
    {
      id: 6,
      title: "TQ"
    },
  ];

  public static PaymentTypes = [
    {
      id: 1,
      title: "Pre Payment"
    },
    {
      id: 2,
      title: "Final Payment"
    },
    {
      id: 3,
      title: "Payment"
    }
  ];


  public static IDCResponseStatus = [
    {
      id: 1,
      title: "Comment and Approved"
    },
    {
      id: 2,
      title: "For Information"
    },
    /*  {
       id : 3,
       title : "Hold"
     } */
  ];

  public static VendorTransmittalTypes = [
    {
      id: 1,
      title: "Receive From Vendor"
    },
    {
      id: 2,
      title: "Issue For Vendor"
    }
  ];

  public static DocumentStates = [
    {
      id: 1,
      title: "Wait On PSL"
    },
    {
      id: 2,
      title: "Rejected By PSL"
    },
    {
      id: 3,
      title: "Wait On QA"
    },
    {
      id: 4,
      title: "Rejected By QA"
    },
    {
      id: 5,
      title: "Wait On Area Manager"
    },
    {
      id: 6,
      title: "Rejected By Area Manager"
    },
    {
      id: 7,
      title: "Wait on Engineering Manager"
    },
    {
      id: 8,
      title: "Rejected By Engineering Manager"
    },
    {
      id: 9,
      title: "Wait On DCC"
    },
    {
      id: 10,
      title: "Rejected By DCC"
    },
    {
      id: 11,
      title: "Post To Client"
    },
  ];

  public static DocumentStateActions = [
    {
      id: 1,
      title: "Expert Submit"
    },
    {
      id: 2,
      title: "PSL Rejected"
    },
    {
      id: 3,
      title: "PSL Submit"
    },
    {
      id: 4,
      title: "QA Rejected"
    },
    {
      id: 5,
      title: "QA Approved"
    },
    {
      id: 6,
      title: "Area Manager Rejected"
    },
    {
      id: 7,
      title: "Area Manager Approved"
    },
    {
      id: 8,
      title: "Engineering Mng Rejected"
    },
    {
      id: 9,
      title: "Engineering Mng Approved"
    },
    {
      id: 10,
      title: "DCC Rejected"
    },
    {
      id: 11,
      title: "Post To Client"
    },
  ];

  public static Priorities = [
    {
      id: 1,
      title: "Low",
      name: ""
    },
    {
      id: 2,
      title: "Medium",
      name: ""
    },
    {
      id: 3,
      title: "High",
      name: ""
    },
  ]


  public static PlannedTaskStates = [
    {
      id: 0,
      title: "Created"
    },
    {
      id: 1,
      title: "Wait On PSL"
    },
    {
      id: 2,
      title: "Wait On Expert"
    },
    {
      id: 3,
      title: "Rejected By PSL"
    },
    {
      id: 4,
      title: "Wait On QA"
    },
    {
      id: 5,
      title: "Rejected By QA"
    },
    {
      id: 6,
      title: "Wait On Area Manager"
    },
    {
      id: 7,
      title: "Rejected By Area Manager"
    },
    {
      id: 8,
      title: "Wait on Engineering Manager"
    },
    {
      id: 9,
      title: "Rejected By Engineering Manager"
    },
    {
      id: 10,
      title: "Wait On DCC"
    },
    {
      id: 11,
      title: "Rejected By DCC"
    },
    {
      id: 12,
      title: "Completed"
    },
    {
      id: 13,
      title: "Canceled"
    }
  ];

  public static PlannedTaskStateActions = [
    {
      id: 0,
      title: "Created"
    },
    {
      id: 1,
      title: "To PSL"
    },
    {
      id: 2,
      title: "To Expert"
    },
    {
      id: 3,
      title: "PSL Rejected"
    },
    {
      id: 4,
      title: "PSL Approved"
    },
    {
      id: 5,
      title: "QA Rejected"
    },
    {
      id: 6,
      title: "QA Approved"
    },
    {
      id: 7,
      title: "Area Manager Rejected"
    },
    {
      id: 8,
      title: "Area Manager Approved"
    },
    {
      id: 9,
      title: "Engineering Mng Rejected"
    },
    {
      id: 10,
      title: "Engineering Mng Approved"
    },
    {
      id: 11,
      title: "DCC Rejected"
    },
    {
      id: 12,
      title: "Post To Client"
    },
    {
      id: 13,
      title: "Canceled"
    },
  ];


  public static TransmittalTypes = [
    {
      id: 1,
      title: "Receive From Client"
    },
    {
      id: 2,
      title: "Issue For Client"
    },
    {
      id: 3,
      title: "Receive From Contractor"
    },
    {
      id: 4,
      title: "Issue For Contractor"
    },
  ];

  public static PageTypes = [
    {
      id: 1,
      title: "A0"
    },
    {
      id: 2,
      title: "A1"
    },
    {
      id: 3,
      title: "A2"
    },
    {
      id: 4,
      title: "A3"
    },
    {
      id: 5,
      title: "A4"
    },
    {
      id: 6,
      title: "A0/A4"
    },
    {
      id: 7,
      title: "A1/A4"
    },
    {
      id: 8,
      title: "A2/A4"
    },
    {
      id: 9,
      title: "A3/A4"
    }
  ];

  public static ConditionFeilds = [
    {
      id: 1,
      title: "Document Status"
    },
    {
      id: 2,
      title: "Document Type"
    },
    {
      id: 3,
      title: "Revision"
    },
  ];

  public static ConditionOprands = [
    {
      id: 1,
      title: "AND"
    },
    {
      id: 2,
      title: "OR"
    }
  ];


  public static EventTypes = [
    {
      id: 1,
      title: "Activity"
    },
    {
      id: 2,
      title: "Task"
    },
    {
      id: 3,
      title: "Hourly Mission"
    },
    {
      id: 4,
      title: "Daily Mission"
    },
    {
      id: 5,
      title: "Overtime"
    },
    {
      id: 6,
      title: "Hourly Vacation"
    },
    {
      id: 7,
      title: "Daily Vacation"
    }
  ];

  public static EventStatus = [
    {
      id: 0,
      title: "Registered"
    },
    {
      id: 1,
      title: "PSL Confirmed"
    },
    {
      id: 2,
      title: "DisciplineHead Confirmed"
    },
    {
      id: 3,
      title: "Area Manager Confirmed"
    },
    {
      id: 4,
      title: "Manager Confirmed"
    },
    {
      id: 5,
      title: "HR Confirmed"
    },
    {
      id: 6,
      title: "Rejected"
    },
    {
      id: 7,
      title: "Edited"
    },    
    {
      id: 10,
      title: "HR Commented Daily Vacation"
    }
  ];
  public static ShamssiMonth = [
    {
      id: 1,
      title: "فروردین"
    },
    {
      id: 2,
      title: "اردیبهشت"
    },
    {
      id: 3,
      title: "خرداد"
    },
    {
      id: 4,
      title: "تیر"
    },
    {
      id: 5,
      title: "مرداد"
    },
    {
      id: 6,
      title: "شهریور"
    },
    {
      id: 7,
      title: "مهر"
    },
    {
      id: 8,
      title: "آبان"
    },
    {
      id: 9,
      title: "آذر"
    },
    {
      id: 10,
      title: "دی"
    },
    {
      id: 11,
      title: "بهمن"
    },
    {
      id: 12,
      title: "اسفند"
    }    
  ];

  public static MiladiMonth = [
    {
      id: 1,
      title: "January"
    },
    {
      id: 2,
      title: "February"
    },
    {
      id: 3,
      title: "March"
    },
    {
      id: 4,
      title: "April"
    },
    {
      id: 5,
      title: "May"
    },
    {
      id: 6,
      title: "June"
    },
    {
      id: 7,
      title: "July"
    },
    {
      id: 8,
      title: "August"
    },
    {
      id: 9,
      title: "September"
    },
    {
      id: 10,
      title: "October"
    },
    {
      id: 11,
      title: "November"
    },
    {
      id: 12,
      title: "December"
    }    
  ];
  public static TimesheetChartFields = [
    {
      id: 1,
      title: "Project",
      name: "project"
    },
    {
      id: 2,
      title: "Section",
      name: "organizationRole"
    },
    {
      id: 3,
      title: "Event Type",
      name: "eventTypeTitle"
    },
    {
      id: 4,
      title: "Department",
      name: "department"
    },
    {
      id: 5,
      title: "Activity",
      name: "activity"
    },
    {
      id: 6,
      title: "Activity Detail",
      name: "activityDetail"
    },
    {
      id: 7,
      title: "Task",
      name: "subject"
    },
    {
      id: 7,
      title: "Owner",
      name: "owner"
    },
    {
      id: 8,
      title: "Status",
      name: "statusTitle"
    }
  ];
}

