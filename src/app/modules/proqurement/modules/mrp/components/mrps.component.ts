import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig} from "@angular/material";
import { GridDataResult,  DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { GroupDescriptor,process, State } from '@progress/kendo-data-query';
import { MrpDetailComponent } from './mrp-detail/mrp-detail.component';
import { MrpItemsModalComponent } from './mrpitems/mrp-items-modal/mrp-items-modal.component';
import { MrpvendorsComponent } from './mrpvendors/mrpvendors.component';
import { MrpdocumentsComponent } from './mrpdocuments/mrpdocuments.component';
import { TbesComponent } from './tbes/tbes.component';
import { CbesComponent } from './cbes/cbes.component';
import { Observer } from 'src/app/home/observer/observer';
import { Subject } from 'src/app/home/observer/subject';
import { isNullOrUndefined } from 'util';
import { Router, ActivatedRoute } from '@angular/router';
import { MRP } from '../models/mrp';
import { MRPService } from '../services/mrp.service';
import { Position } from 'src/app/modules/general/enums/position.enum';
import * as _ from 'lodash';

export interface MrpDialogData {
  mrp: MRP;
} 

@Component({
  selector: 'app-mrps',
  templateUrl: './mrps.component.html',
  styleUrls: ['./mrps.component.css']
})

export class MrpsComponent implements OnInit,Observer {
 
  isLoading : boolean;
  public gridView: GridDataResult;
  public groups: GroupDescriptor[] =[];
  public selectionRows: any[] = [];
  private mrps: MRP[] 
  public mode: string;
  public state: State = {
    skip: 0,
    take: 10,
    group: this.groups      
};

  constructor(private dialog: MatDialog,private mrpService : MRPService,
               public subject: Subject, private router: Router,private route: ActivatedRoute )
   {
    this.isLoading = true;
    this.mode =  this.route.snapshot.routeConfig.path;
    this.mrps = [];
    this.subject = subject;
    this.subject.attach(this);
  }

  public ngOnInit(): void {
    this.getMRPs();
}

  private setGrid(): void {      
       this.gridView = process(this.mrps,this.state);
  }
  
  refresh(): void {
  
    this.getMRPs();
  }

  getMRPs(): void {
  
    if (isNullOrUndefined(this.subject.getState()))
    {
      this.mrps = [];
      this.setGrid();
       return;
    }

    this.isLoading = true;
    var project = this.subject.getState(); 
  //  var urlParams = `${project.id}/null`;
   // var role = _.maxBy(project.roles,'positionId')
    // is PSL
   // if (role.positionId == Position.PSL)
   //   urlParams = `${project.id.toString()}/${role.disciplineId}`

    this.mrpService.getListByPost('GetAll',project)
    .subscribe( (result : any) =>  {
      this.isLoading = false;
      _.forEach(result.data,(m : MRP) => {
           m.creationDate = new Date(m.creationDate);
        }) 
        this.mrps = result.data;
        this.setGrid();
    }, error => {    
      this.isLoading = false;
    });  
  }

  public dataStateChange(state: DataStateChangeEvent): void {
  /*  _.forEach(state.filter.filters ,fil => {
     if (fil["field"] == 'creationDate')
       fil["value"] = fil["value"].toISOString();
   }); */
    this.state = state;
    this.setGrid();
}

public new()
{
    this.openDetail(null);
}

public edit()
{
    if (this.selectionRows.length > 0)
    {
    var item = this.mrps.find((row: any) => { return row.id ==  this.selectionRows[0];})
    this.openDetail(item);
    }
    else
    {
      alert("Please select MRP!");
    }
}

delete()
{
  if (this.selectionRows.length > 0)
  { 
    var item = this.mrps.find((row: any) => { return row.id ==  this.selectionRows[0];})
    if(confirm(`Are you sure to delete  "${item.mrpNo}"`)) {
     this.isLoading = true;
      this.mrpService.Delete(item).subscribe( result => {
         this.getMRPs();
       }, error => {
  
         this.isLoading = false;;
         alert(`Item "${item.mrpNo}" is used. Could not be deleted.`);
     });
   }
  }
}

public openDetail(row : any)
  {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = "900px";
    dialogConfig.height = "550px";
    dialogConfig.data = row;

    const dialogRef = this.dialog.open(MrpDetailComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
        if (result !== null)
         this.getMRPs();

      });      
   }

   openMrtItems()
   {
    if (this.selectionRows.length > 0)
    {
       var item = this.mrps.find((row: any) => { return row.id ==  this.selectionRows[0];})
    
       const dialogConfig = new MatDialogConfig();
       dialogConfig.disableClose = true;
       dialogConfig.autoFocus = false;
       dialogConfig.width = "900px";
       dialogConfig.height = "450px";
       dialogConfig.data = { mrp :item };
      const dialogRef = this.dialog.open(MrpItemsModalComponent, dialogConfig);
     
     }
     else
     {
       alert("Please select MRP!");
     }
   }
 
   openMrpVendors()
   {
    if (this.selectionRows.length > 0)
    {
       var item = this.mrps.find((row: any) => { return row.id ==  this.selectionRows[0];})
    
       const dialogConfig = new MatDialogConfig();
       dialogConfig.disableClose = true;
       dialogConfig.autoFocus = false;
       dialogConfig.width = "900px";
       dialogConfig.height = "420px";
       dialogConfig.data = { mrp :item };

      const dialogRef = this.dialog.open(MrpvendorsComponent, dialogConfig);     
    }
    else
    {
      alert("Please select MRP!");
    }
   }
 
   openMrpDocuments()
   {
    if (this.selectionRows.length > 0)
    {
       var item = this.mrps.find((row: any) => { return row.id ==  this.selectionRows[0];})    
       const dialogConfig = new MatDialogConfig();
       dialogConfig.disableClose = true;
       dialogConfig.autoFocus = false;
       dialogConfig.width = "800px";
       dialogConfig.height = "530px";
       dialogConfig.data = { mrp :item };

      const dialogRef = this.dialog.open(MrpdocumentsComponent, dialogConfig);     
    }
    else
    {
      alert("Please select MRP!");
    }
   }
 
   openMrpVendorFlows()
   {
    if (this.selectionRows.length > 0)
    {
       var item = this.mrps.find((row: any) => { return row.id ==  this.selectionRows[0];})
       this.router.navigate([`/home/procurement/preOrder/vendorflow/${item.id}`]);     
    }
    else
    {
      alert("Please select MRP!");
    }
   }

   openTBE()
   {
       if (this.selectionRows.length > 0)
       {
          var item = this.mrps.find((row: any) => { return row.id ==  this.selectionRows[0];})    
          const dialogConfig = new MatDialogConfig();
          dialogConfig.disableClose = true;
          dialogConfig.autoFocus = false;
          dialogConfig.width = "800px";
          dialogConfig.height = "520px";
          dialogConfig.data = { mrp :item };

          const dialogRef = this.dialog.open(TbesComponent, dialogConfig);     
       }
       else
       {
         alert("Please select MRP!");
       }
   }

   openCBE()
   {
       if (this.selectionRows.length > 0)
       {
          var item = this.mrps.find((row: any) => { return row.id ==  this.selectionRows[0];})    
          const dialogConfig = new MatDialogConfig();
          dialogConfig.disableClose = true;
          dialogConfig.autoFocus = false;
          dialogConfig.width = "800px";
          dialogConfig.height = "520px";
          dialogConfig.data = { mrp :item };
          const dialogRef = this.dialog.open(CbesComponent, dialogConfig);     
       }
       else
       {
         alert("Please select MRP!");
       }
   }
}

