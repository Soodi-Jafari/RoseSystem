import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { switchMap, tap, delay, map } from 'rxjs/operators';
import { from } from 'rxjs';
import { LookupValue } from 'src/app/models/lookup-value';
import { isNullOrUndefined } from 'util';
import { MRP } from '../../../models/mrp';
import { MrpVendor } from '../../../models/mrp-vendor';
import { MRPVendorService } from '../../../services/mrp-vendor.service';
import { MRPService } from '../../../services/mrp.service';


export interface DialogData {
  mrpVendor: any;
  mrp: MRP;
}

@Component({
  selector: 'app-mrpvendor-detail',
  templateUrl: './mrpvendor-detail.component.html',
  styleUrls: ['./mrpvendor-detail.component.css']
})
export class MrpvendorDetailComponent implements OnInit {

  @ViewChild("vendorList") vendorList;

  public sourceVendors: Array<LookupValue>

  viewModel : MrpVendor;
  public vendors: Array<LookupValue>
  isLoading: boolean;
  constructor(public vendorService : MRPVendorService,
               public dialogRef: MatDialogRef<MrpvendorDetailComponent>,
               private mrpService : MRPService,
                   @Inject(MAT_DIALOG_DATA) public data: DialogData) {
            this.isLoading = true;
   }

  ngOnInit(){
    this.getMrp();
    this.viewModel = new MrpVendor();
    if (!isNullOrUndefined(this.data.mrpVendor))
        this.getMrpVendor(this.data.mrpVendor.id); 
  }

  getMrp()
  {
    this.mrpService.getSingle("GetSingle",this.data.mrp.id.toString()).subscribe((result : any) => 
    {
      var itemIds =  result.model.items.map((it : any) => { return it.id})  ;
      this.getVendorsLookup(itemIds);     
    });
  }
 
   ngAfterViewInit() {
    const vendorContain = value => s => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1;

    this.vendorList.filterChange.asObservable().pipe(
          switchMap(value => from([this.sourceVendors]).pipe(
              tap(() => this.vendorList.loading = true),
              delay(1000),
              map((vendors) => vendors.filter(vendorContain(value)))
          ))
      )
      .subscribe(x => {
          this.vendors = x;
      });     
  }
 
  getMrpVendor(id: number)
  {
    this.vendorService.getSingle('GetSingle', id.toString()).subscribe((result : any) => this.viewModel = result.model);
  }

  getVendorsLookup(ids: any)
  {
    this.vendorService.getVendorsLookup(ids).subscribe((result : any) =>     {
       this.vendors =  this.sourceVendors =  result.data;
       this.isLoading = false;
    }, error => {    
      this.isLoading = false;
    });  
  } 
    
  save()
  {
    this.viewModel.mrpId = this.data.mrp.id
    if (isNullOrUndefined(this.viewModel.vendor))
    {
         alert("Please enter required fields!");
          return;
    }

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


