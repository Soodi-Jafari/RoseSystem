export let MENU_ITEM = [
    {
        path: 'dashboard',
        title: 'Dashboard',
        icon: 'dashboard',
        permission: ''     
    },
    {
        path: 'baseinfo',
        title: 'Base Info',
        permission: 'baseInfo',
        icon: 'folder-open', 
        children: [
            {
                path: 'users',
                title: 'Users',
                permission: 'viewUsers',                
            },
            {
                path: 'projects',
                title: 'Projects',
                permission: 'viewProject',                
            },
            {
                path: 'customers',
                title: 'Customers',
                permission: 'viewCustomers',                
            },
            {
                path: 'projectPositions',
                title: 'Project Positions',
                permission: 'viewProjectPosition',                
            },
            {
                path: 'organizationPositions',
                title: 'Organization Positions',
                permission: 'viewOrganizationPosition',                
            }, 
            {
                path: 'pctLevels',
                title: 'PCT Conditions',
                permission: 'viewPctLevels',                
            },            
        ]
    }, 
    {
        path: 'procurement',
        title: 'Procurement',
        icon: 'money',
        permission: 'procurement',
        children: [
            {
                path: 'cartable',
                title: 'Procurement Cartable',
                permission: 'procurement',
            },
            {
                path: 'baseTabel',
                title: 'Base Table',
                permission: 'baseTable',
                children: [
                    {
                        path: 'procumentItems',
                        title: 'Item Definition',
                        permission: 'viewItem',
                    },
                    {
                        path: 'vendors',
                        title: 'Vendor Definition',
                        permission: 'viewVendor'
                    },
                    {
                        path: 'mrps',
                        title: 'MRP Definition',
                        permission: 'viewMRP',
                    }
                ]
            },
            {
                path: 'preOrder',
                title: 'Pre Order (MR Packs)',
                permission: 'viewMRP',
            },
            {
                path: 'contracts',
                title: 'Order (Contracts)',
                permission: 'viewContract',
            },
            {
                path: 'vendorOffer',
                title: 'Vendor Offer List',
                permission: 'viewMrpVendorFlow',
            },
            {
                path: 'vendorDocument',
                title: 'Vendor Document List',
                permission: 'viewMrpVendorFlow',
            },
            {
                path: 'vendorIdc',
                title: 'Vendor IDCs',
                permission: 'idcMrpVendorFlow',
            },
            {
                path: 'vpisreport',
                title: 'VPIS Report',
                permission: 'idcMrpVendorFlow',
            },
            {
                path: 'delay-report',
                title: 'Delay Report',
                permission: '',
            },
           
        ]
    },
    {
        path: 'task',
        title: 'Task Management',
        permission: 'task',
        icon: 'tasks', 
        children: [
            {
                path: 'taskCartable',
                title: 'Task Cartable',
                permission: 'task',                
            },  
            {
                path: 'createPlannedTask',
                title: 'Create Planned Tasks',
                permission: 'createPlannedTask',                
            },  
            {
                path: 'assignPlannedTask',
                title: 'Assign Planned Tasks',
                permission: 'assignPlannedTask',                
            },   
            {
                path: 'plannedTaskList',
                title: 'Planned Task List',
                permission: 'task',                
            },   
            {
                path: 'rejectedPlannedTasks',
                title: 'Rejected Tasks',
                permission: 'rejectedPlannedTasks',                
            },   
            {
                path: 'plannedTaskIdcs',
                title: 'Document IDCs',
                permission: 'idcMrpVendorFlow',                
            },                   
        ]
    }, 
    {
        path: 'document',
        title: 'Document Management',
        permission: 'document',
        icon: 'industry', 
        children: [
            {
                path: 'transmittal',
                title: 'Transmittals',
                permission: 'viewTransmittal',                
            },
            {
                path: 'transmittalDocuments',
                title: 'Transmittal Documents',
                permission: 'viewTransmittalDoc',                
            },  
            {
                path: 'pctDocuments',
                title: 'Documents Progress Table',
                permission: 'viewTransmittalDocPCT',                
            },  
            {
                path: 'importDocumentWeight',
                title: 'Import Document Weight',
                permission: 'viewTransmittalDocPCT',                
            }           
        ]
    }, 
    {
        path: 'timesheet',
        title: 'Time Management',
        icon: 'clock-o',
        permission: '',  
        children: [
            {
                path: 'activities',
                title: 'Activities',
                permission: 'viewActivity',                
            }, 
            {
                path: 'userTimesheet',
                title: 'Timesheet',
                permission: '',                
            }, 
            {
                path: 'personnelInout',
                title: 'Personnel In/out',
                permission: '',                
            },
            {
                path: 'userRequests',
                title: 'User Requests',
                permission: '',                
            },
            {
                path: 'confirmEvents',
                title: 'Confirm Requests',
                permission: '',                
            },   
            {
                path: 'personnelOnoff',
                title: 'Employees Attendance',
                permission: '',                
            },   
            {
                path: 'report',
                title: 'Reports',
                permission: '',
                children: [                       
                    {
                        path: 'timesheetChart',
                        title: 'Timesheet Chart',
                        permission: 'viewTimesheetChart',            
                    },           
                    {
                        path: 'disciplinePlanReport',
                        title: 'Discipline Plan Report',
                        permission: '',                
                    },  
                    {
                        path: 'disciplinePlanResource',
                        title: 'Discipline Plan Resources',
                        permission: '',                
                    },    
                    {
                        path: 'timesheetReport',
                        title: 'User Timesheet Report',
                        permission: '',                
                    },       
                ]
            },       
           
        ]     
    },  
        
];
