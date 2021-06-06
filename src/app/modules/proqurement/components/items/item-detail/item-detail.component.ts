import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { switchMap, tap, delay, map } from 'rxjs/operators';
import { from } from 'rxjs';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';
import { isNullOrUndefined } from 'util';
import { LookupValue } from 'src/app/models/lookup-value';
import { ItemService } from '../../../services/item.service';
import { ProcurementItem } from '../../../models/procurement-item';

export interface DialogData {
  id: number;
}

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.css']
})

export class ItemDetailComponent implements OnInit {
   @ViewChild("categoryList") categoryList;
   @ViewChild("unitList") unitList;
   
  public sourceCategories: Array<LookupValue>
  public sourceUnits: Array<LookupValue>

  viewModel : ProcurementItem;
  public categories: Array<LookupValue>
  public units: Array<LookupValue>
  isLoading : boolean;

  constructor(public itemService : ItemService, public dialogRef: MatDialogRef<ItemDetailComponent>,
                   @Inject(MAT_DIALOG_DATA) public data: DialogData) {
               this.isLoading = true;
   }

  ngOnInit(){
    this.viewModel = new ProcurementItem();
    if (!isNullOrUndefined(this.data))
        this.getItem(this.data.id);

    this.getLookups();   
  }
 
   ngAfterViewInit() {
    const categoryContain = value => s => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1;
    const unitContain = value => s => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1;

    this.categoryList.filterChange.asObservable().pipe(
          switchMap(value => from([this.sourceCategories]).pipe(
              tap(() => this.categoryList.loading = true),
              delay(1000),
              map((items) => items.filter(categoryContain(value)))
          ))
      )
      .subscribe(x => {
          this.categories = x;
      });

      this.unitList.filterChange.asObservable().pipe(
        switchMap(value => from([this.sourceUnits]).pipe(
            tap(() => this.unitList.loading = true),
            delay(1000),
            map((items) => items.filter(unitContain(value)))
        ))
    )
    .subscribe(x => {
        this.units = x;
    });
  }
 
  getItem(id: number)
  {
    this.itemService.getSingle('GetSingle', id.toString()).subscribe((result : any) => {
      this.isLoading = false;
      this.viewModel = result.model;}, error => {    
        this.isLoading = false;
    });     
  }

  getLookups()
  {
    this.itemService.getListLookup('GetLookups').subscribe((data : any) => 
    {
        this.isLoading = false;
        this.categories = this.sourceCategories = data.categories;
        this.units = this.sourceUnits = data.unitOfMeasures;
    }, error => {    
      this.isLoading = false;
  });     
  }
  
  save()
  {
    if (isNullOrEmptyString(this.viewModel.description) || isNullOrEmptyString(this.viewModel.title)
             || isNullOrUndefined(this.viewModel.decipline))
             {
                  alert("Please enter required fields!");
                   return;

             }
    this.isLoading = true;
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




