import { Component, OnInit, ViewChild, Input, EventEmitter, Output, SimpleChanges } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { Project } from 'src/app/models/project';
import { SystemType } from 'src/app/modules/general/enums/system-type';
import { IdcService } from 'src/app/modules/proqurement/services/idc.service';
import { Router } from '@angular/router';
import { Idc } from 'src/app/modules/proqurement/models/idc';

@Component({
  selector: 'app-grid-idc-dashboard',
  templateUrl: './grid-idc-dashboard.component.html',
  styleUrls: ['./grid-idc-dashboard.component.css']
})
export class GridIdcDashboardComponent implements OnInit {

  isLoading : boolean;
  displayedColumns: string[] = ['view','desciplineName','dueDate','status','entityType'];  
  idcs: any
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  @Input() public project: Project;
  @Input() public type: SystemType;
  @Output() idcChanged = new EventEmitter<number>();

  constructor(private idcService : IdcService, private router: Router) { }

  ngOnInit() {
    this.idcs = new MatTableDataSource<any>([]);
    this.idcs.paginator = this.paginator; 
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['project'])
    {
      if (this.type == SystemType.Procurement)
         this.getProcurementIdcs();
      else if (this.type == SystemType.Task)
         this.getTaskIdcs();
    }
  }
  
  getProcurementIdcs() : void {    
    this.isLoading = true;
    this.idcService.getListByPost('IdcCartable',this.project)
    .subscribe( (result : any) =>  {
       this.isLoading = false;
       this.idcs = new MatTableDataSource<Idc>(result.data);
       this.idcs.paginator = this.paginator; 
       this.idcChanged.emit(result.data.length);
     }, error => {    
      this.isLoading = false;
  });            
}


getTaskIdcs() : void {    
  this.isLoading = true;
  this.idcService.getListByPost('TaskIdcCartable',this.project)
  .subscribe( (result : any) =>  {
     this.isLoading = false;
     this.idcs = new MatTableDataSource<Idc>(result.data);
       this.idcs.paginator = this.paginator; 
       this.idcChanged.emit(result.data.length);
   }, error => {    
    this.isLoading = false;
});                
}


public viewDetail(row: any)
{
   this.router.navigate([`/home/procurement/idc/${row.id}/${row.entityId}/${row.entityType}`]);       
 } 


}
