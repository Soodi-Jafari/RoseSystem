import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { switchMap, tap, delay, map } from 'rxjs/operators';
import { from } from 'rxjs';
import { LookupValue } from 'src/app/models/lookup-value';
import { Vendor } from '../../../models/vendor';
import { VendorService } from '../../../services/vendor.service';
import { isNullOrUndefined } from 'util';

export interface DialogData {
  id: number;
}

@Component({
  selector: 'app-vendor-detail',
  templateUrl: './vendor-detail.component.html',
  styleUrls: ['./vendor-detail.component.css']
})

 export class VendorDetailComponent implements OnInit {
  @ViewChild("list") list;
  isLoading: boolean;
  public sourceItemes: Array<LookupValue> 

  viewModel : Vendor;
  public items: Array<LookupValue>
  constructor(public vendorService : VendorService, public dialogRef: MatDialogRef<VendorDetailComponent>,
                   @Inject(MAT_DIALOG_DATA) public data: DialogData) {

              this.isLoading = true;    
   }

  ngOnInit(){
    this.getItemsLookup();
    this.viewModel = new Vendor();
    if (!isNullOrUndefined(this.data))
        this.getVendor(this.data.id);
  }
 
  ngAfterViewInit() {
    const contains = value => s => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1;

    this.list.filterChange.asObservable().pipe(
          switchMap(value => from([this.sourceItemes]).pipe(
              tap(() => this.list.loading = true),
              delay(1000),
              map((items) => items.filter(contains(value)))
          ))
      )
      .subscribe(x => {
          this.items = x;
      });
  }

  getVendor(id: number)
  {
    this.isLoading = true;
    this.vendorService.getSingle('GetSingle', id.toString()).subscribe((result: any) => {
      this.isLoading = false;
      this.viewModel = result.model;
    }, error => {    
      this.isLoading = false;
  });     
  }
  
  getItemsLookup()
  {
    this.vendorService.getItemsLookup().subscribe((result : any) =>     {
       this.items =  this.sourceItemes =  result.data;
       this.isLoading = false;
    });
  }

  save()
  {
    this.isLoading = true;
    this.vendorService.Post(this.viewModel).subscribe( result => {
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



