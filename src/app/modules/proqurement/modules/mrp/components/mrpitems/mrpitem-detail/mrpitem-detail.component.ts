import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { switchMap, tap, delay, map } from 'rxjs/operators';
import { from } from 'rxjs';
import { LookupValue } from 'src/app/models/lookup-value';
import { isNullOrUndefined } from 'util';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';
import { MrpItem } from '../../../models/mrp-item';
import { MRPItemService } from '../../../services/mrp-item.service';
import { MRP } from '../../../models/mrp';


export interface DialogData {
  mrpItem: any;
  mrp: MRP;
}


@Component({
  selector: 'app-mrpitem-detail',
  templateUrl: './mrpitem-detail.component.html',
  styleUrls: ['./mrpitem-detail.component.css']
})


export class MrpitemDetailComponent implements OnInit {
   @ViewChild("itemList") itemList;
   @ViewChild("unitList") unitList;

  isLoading: boolean;
  public sourceItems: Array<LookupValue>
  public sourceUnits: Array<LookupValue>

  viewModel : MrpItem;
  public items: Array<LookupValue>
  public units: Array<LookupValue>

  constructor(public itemService : MRPItemService, public dialogRef: MatDialogRef<MrpitemDetailComponent>,
                   @Inject(MAT_DIALOG_DATA) public data: DialogData) {
                this.isLoading = true;
   }

  ngOnInit(){
    this.getLookups();
    this.viewModel = new MrpItem();
    if (!isNullOrUndefined(this.data.mrpItem))
        this.getMrpItem(this.data.mrpItem.id); 
  }
 
   ngAfterViewInit() {
    const itemContain = value => s => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1;
    const unitContain = value => s => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1;

    this.itemList.filterChange.asObservable().pipe(
          switchMap(value => from([this.sourceItems]).pipe(
              tap(() => this.itemList.loading = true),
              delay(1000),
              map((items) => items.filter(itemContain(value)))
          ))
      )
      .subscribe(x => {
          this.items = x;
      });

      this.unitList.filterChange.asObservable().pipe(
        switchMap(value => from([this.sourceUnits]).pipe(
            tap(() => this.unitList.loading = true),
            delay(1000),
            map((units) => units.filter(unitContain(value)))
        ))
    )
    .subscribe(x => {
        this.units = x;
    });
  }
 
  getMrpItem(id: number)
  {
    this.itemService.getSingle('GetSingle', id.toString()).subscribe((result : any) => this.viewModel = result.model, error => {    
      this.isLoading = false;
    });  
  }

  getLookups()
  {
    this.itemService.getListLookup('GetLookups',this.data.mrp.disciplineId.toString()).subscribe((data : any) => 
    {
        this.isLoading = false;
        this.items = this.sourceItems = data.items;
        this.units = this.sourceUnits = data.currencyUnits;
    }, error => {    
      this.isLoading = false;
    });  
  }
  
  save()
  {
    if (isNullOrUndefined(this.viewModel.item))
    {
         alert("Please enter required fields!");
          return;
    }

    this.isLoading = true;
    this.viewModel.mrpId = this.data.mrp.id
    this.itemService.Post(this.viewModel).subscribe( result => {
        this.isLoading = false;
        this.dialogRef.close(this.viewModel);
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

  closeDialog() {
    this.dialogRef.close();
  }
}

