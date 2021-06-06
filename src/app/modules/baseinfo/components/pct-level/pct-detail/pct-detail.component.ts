import { Component, OnInit, ViewChild } from '@angular/core';
import { LookupValue, GuidLookupValue } from 'src/app/models/lookup-value';
import { PCTLevel } from '../../../models/pct-level';
import { PCTService } from '../../../services/pct.service';
import { isNullOrUndefined } from 'util';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { from } from 'rxjs';
import { switchMap, tap, delay, map } from 'rxjs/operators';
import { State,process } from '@progress/kendo-data-query';
import { GridComponent, GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { PctConditionComponent } from '../pct-condition/pct-condition.component';
import { EnumCoding } from 'src/app/modules/general/enums/enum-coding';

@Component({
  selector: 'app-pct-detail',
  templateUrl: './pct-detail.component.html',
  styleUrls: ['./pct-detail.component.css']
})
export class PctDetailComponent implements OnInit {
  @ViewChild("projectList") projectList;  
 public sourceProjects: Array<GuidLookupValue>

 viewModel : PCTLevel;
 public customers: Array<GuidLookupValue>
 public projects: Array<GuidLookupValue>
 public purposeOfIssues: Array<LookupValue>
 isLoading : boolean;
 gridView: GridDataResult;
 @ViewChild("grid") private grid: GridComponent;
 public selectionRows: any[] = []; 
 state: State = {
};

 constructor(public itemService : PCTService,private router : Router,private route: ActivatedRoute,private dialog: MatDialog) {
              
  }

 ngOnInit(){
   this.customers = [];
   this.viewModel = new PCTLevel();
   this.viewModel.id = parseInt(this.route.snapshot.paramMap.get('id'))
   this.getLookups();   
   if (!_.isNaN( this.viewModel.id))
       this.getItem(this.viewModel.id);
 }

  ngAfterViewInit() {
   const projectContain = value => s => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1;
   this.projectList.filterChange.asObservable().pipe(
         switchMap(value => from([this.sourceProjects]).pipe(
             tap(() => this.projectList.loading = true),
             delay(1000),
             map((items) => items.filter(projectContain(value)))
         ))
     )
     .subscribe(x => {
         this.projects = x;
     });
    
 }

 getItem(id: number)
 {
   this.isLoading = true;
   this.itemService.getSingle('GetSingle', `${id}`).subscribe((result : any) => {
     this.isLoading = false;
     this.viewModel = result.model;
     this.setGrid();
     this.getCustomers(this.viewModel.project.id);
    });
 }

 getLookups()
 {
   this.isLoading = true;
   this.itemService.getListLookup('PurposeOfIssues').subscribe((data : any) => 
   {
       this.isLoading = false;
       this.purposeOfIssues = data.data;
   }, error => {    
    this.isLoading = false;
   });     

  this.itemService.getListLookup('AllProjects').subscribe((data : any) => 
   {
       this.isLoading = false;
       this.projects = this.sourceProjects = data.data;
   }, error => {    
    this.isLoading = false;
   });     
 }

 getCustomers(projectId)
 {
     this.itemService.getListLookup('ProjectCustomers',`${projectId}`).subscribe((data : any) => 
       {
            this.isLoading = false;
            this.customers = data.data;
       }, error => {    
        this.isLoading = false;
      });       
 }

 public projectSelectionChange(value: any): void {

  if (!isNullOrUndefined(value))
  {
     this.getCustomers(value.id);
  }
  else
  {
     this.customers = [];
     this.viewModel.customer = undefined;
  }
} 
    
private setGrid(): void {      
  this.gridView = process(this.viewModel.conditions,this.state);   
}
public dataStateChange(state: DataStateChangeEvent): void {
  this.state = state;
  this.setGrid();
}

 save()
 {
   if (isNullOrUndefined(this.viewModel.pct) || isNullOrUndefined(this.viewModel.customer)
            || isNullOrUndefined(this.viewModel.project)|| isNullOrUndefined(this.viewModel.purposeOfIssue))
            {
                 alert("Please enter required fields!");
                  return;
            }
   this.isLoading = true;
   this.itemService.Post(this.viewModel).subscribe( result => {
       this.isLoading = false;
       this.router.navigate([`/home/baseinfo/pctLevels`]); 
   }, error => {
     this.isLoading = false;
     var errMessage ='';
     if (error.error.length > 0)
         error.error.forEach((err: string) => errMessage = errMessage +  err + '\n');           
     else
        errMessage = error.error.ExceptionMessage;
              
      alert(errMessage);
   });
 }

 cancel() {
  this.router.navigate([`/home/baseinfo/pctLevels`]);  
 }

 public newCondition()
{
    this.openDetail(null);
}

public editCondition()
{
    if (this.selectionRows.length > 0)
    {
    var item = this.viewModel.conditions.find((row: any) => { return row.id ==  this.selectionRows[0];})
    this.openDetail(item);
    }
}

public openDetail(row : any)
  {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = "600px";
    dialogConfig.height = "350px";
    dialogConfig.data = row;

    const dialogRef = this.dialog.open(PctConditionComponent, dialogConfig);
     dialogRef.afterClosed().subscribe(result => {

        if (!isNullOrUndefined(result))
        {
          var max = _.maxBy(this.viewModel.conditions,'id');
          var indx = isNullOrUndefined(max) ? 0 : max.id;
          result.id = indx + 1;
          // var item = this.viewModel.conditions.find((row: any) => { return row.id ==  result.id;})
         //  if (item == null)
              this.viewModel.conditions.push(result);
        //   else
          //    item = result
           this.setGrid();
        }
      });       
   }
 
   deleteCondition()
   {
     if (this.selectionRows.length > 0)
     { 
       var item = this.viewModel.conditions.find((row: any) => { return row.id ==  this.selectionRows[0];})
       if(confirm(`Are you sure to delete condition`)) {
        _.remove(this.viewModel.conditions, (c) => c.id == item.id);
       }
     }
   }

   getFieldTitle(id)
   {
     if (!isNullOrUndefined(id))
       return EnumCoding.ConditionFeilds.find((t : any) => t.id == id).title;
   }
   getOperandTitle(id)
   {
     if (!isNullOrUndefined(id))
       return EnumCoding.ConditionOprands.find((t : any) => t.id == id).title;
   }

}

