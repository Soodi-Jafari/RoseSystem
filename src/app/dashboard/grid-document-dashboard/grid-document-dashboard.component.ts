import { Component, OnInit, ViewChild, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { Project } from 'src/app/models/project';
import { MRPVendorFlowService } from 'src/app/modules/proqurement/modules/mrp/services/mrp-vendor-flow.service';
import { Router } from '@angular/router';
import { EnumCoding } from 'src/app/modules/general/enums/enum-coding';
import { EntityType } from 'src/app/modules/general/enums/entity-type.enum';
import { VDRService } from 'src/app/modules/proqurement/modules/contract/services/vdr.service';
import { PlannedTaskService } from 'src/app/modules/task/services/planned-task.service';


@Component({
  selector: 'app-grid-document-dashboard',
  templateUrl: './grid-document-dashboard.component.html',
  styleUrls: ['./grid-document-dashboard.component.css']
})
export class GridDocumentDashboardComponent implements OnInit {
  
  isLoading : boolean;
  displayedColumns: string[] = ['view','documentNo','dueDate','state','discipline'];  
  documents : any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  @Input() public project: Project;
  @Input() public type: EntityType;
  @Output() sourcechanged = new EventEmitter<number>();

  constructor(public vendorFlowService : MRPVendorFlowService,private router: Router,public vdrService: VDRService,
               public taskService : PlannedTaskService) {
        
   }

  ngOnInit() {
    this.documents = new MatTableDataSource<any>([]);
    this.documents.paginator = this.paginator; 
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['project'])
    {
      if (this.type == EntityType.MRPVendorFlow)
         this.getMRPVendorFlows();
      else if (this.type == EntityType.VendorTransmittal)
         this.getVendorTransmittals();
     else if (this.type == EntityType.Task)
         this.getPlannedTasks();
    }
  }

  getMRPVendorFlows() : void {    

    this.isLoading = true;
    this.vendorFlowService.getListByPost('MRPVendorFlowCartable',this.project)
    .subscribe( (result : any) =>  {
       this.isLoading = false;
       var docs = result.data.map((item : any) =>  {
          return  {
              id : item.id,
              state:  EnumCoding.vendorFlowStates.find((t : any) => t.id == item.currentState).title,
              dueDate:  item.deadline,
              documentNo: item.subject,
              discipline: item.discipline,
              mrpId: item.mrpId,
              vendor: item.vendor
          };
       });
       this.documents = new MatTableDataSource<any>(docs);
       this.documents.paginator = this.paginator; 
       this.sourcechanged.emit(docs.length);
     }, error => {
    
      this.isLoading = false;
  }); 
  }
  
  getVendorTransmittals() : void {    

    this.isLoading = true;
    this.vdrService.getListByPost('VdrCartable',this.project)
    .subscribe( (result : any) =>  {
       this.isLoading = false;
       var docs = result.data.map((item : any) =>  {
        return  {
            id : item.id,
            state:  EnumCoding.vendorFlowStates.find((t : any) => t.id == item.currentState).title,
            dueDate:  item.deadline,
            documentNo: item.vpis.title,
            discipline: item.discipline
        };
     });
     this.documents = new MatTableDataSource<any>(docs);
     this.documents.paginator = this.paginator; 
     this.sourcechanged.emit(docs.length);
     }, error => {
    
      this.isLoading = false;
  });    
  }

  getPlannedTasks() : void {    

    this.isLoading = true;
    this.taskService.getListByPost('PlannedTaskCartable',this.project)
    .subscribe( (result : any) =>  {
       this.isLoading = false;
       var docs = result.data.map((item : any) =>  {
        return  {
            id : item.id,
            state:  EnumCoding.PlannedTaskStates.find((t : any) => t.id == item.currentState).title,
            dueDate:  item.dueDate,
            documentNo: item.documentNo,
            discipline: item.disciplineName
        };
     });
     this.documents = new MatTableDataSource<any>(docs);
     this.documents.paginator = this.paginator; 
     this.sourcechanged.emit(docs.length);
     }, error => {
    
      this.isLoading = false;
  });    
}
    
  public viewDetail(row: any)
  {
    if (this.type == EntityType.MRPVendorFlow)
       this.router.navigate([`/home/procurement/preOrder/vendorflow/detail/${row.mrpId}/${row.vendor.id}/${row.vendor.title}/${row.id}/null`]);       
    else if (this.type == EntityType.VendorTransmittal)
       this.router.navigate([`/home/procurement/vdr/${row.id}`]);   
    else if (this.type == EntityType.Task)  
       this.router.navigate([`/home/task/plannedTaskApproval/${row.id}`]);         
  } 

}
