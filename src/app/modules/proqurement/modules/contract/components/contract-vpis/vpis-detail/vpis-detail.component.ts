import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { VPIS } from '../../../models/VPIS';
import { VPISService } from '../../../services/vpis.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { isNullOrUndefined } from 'util';
import { LookupValue } from 'src/app/models/lookup-value';
import { switchMap, tap, delay, map } from 'rxjs/operators';
import { from } from 'rxjs';

@Component({
  selector: 'app-vpis-detail',
  templateUrl: './vpis-detail.component.html',
  styleUrls: ['./vpis-detail.component.css']
})
export class VPISDetailComponent implements OnInit {
  
  isLoading: boolean;
  viewModel : VPIS;
  @ViewChild("descList") descList;  
  public sourceDesc: Array<LookupValue>
  public desciplines: Array<LookupValue>

  constructor(public vpisService : VPISService,public dialogRef: MatDialogRef<VPISDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
     
    this.viewModel = new VPIS();   
    
}
  ngOnInit() {
    this.getLookups();  
    debugger;
    if (!isNullOrUndefined(this.data.vpis))
        this.getVpis(this.data.vpis.id);
    else
     {
        this.viewModel.descipline =  { id : this.data.contract.disciplineId, title : this.data.contract.discipline, name:"" }
     }    
  }

  getVpis(id: number)
  {
    this.isLoading = true;
    this.vpisService.getSingle('GetSingle', id.toString()).subscribe((result: any) => 
     {
        this.isLoading = false;
        this.viewModel = result.model;  
     }, error => {    
      this.isLoading = false;
    });   
  }
  
  ngAfterViewInit() {
    const descContain = value => s => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1;

    this.descList.filterChange.asObservable().pipe(
          switchMap(value => from([this.sourceDesc]).pipe(
              tap(() => this.descList.loading = true),
              delay(1000),
              map((items) => items.filter(descContain(value)))
          ))
      )
      .subscribe(x => {
          this.desciplines = x;
      });
  }

  getLookups()
  {
    this.vpisService.getListLookup('GetLookups').subscribe((data : any) => 
    {
        this.isLoading = false;
        this.desciplines = this.sourceDesc = data.desciplines;
    }, error => {    
      this.isLoading = false;
    });   
  }

  save()
  {
    if (isNullOrUndefined(this.viewModel.documentNo) || isNullOrUndefined(this.viewModel.description) 
        || isNullOrUndefined(this.viewModel.descipline))
             {
                  alert("Please enter required fields!");
                  return;
             }
    this.isLoading = true;  
    this.viewModel.contractId = this.data.contract.id;
    this.vpisService.Post(this.viewModel).subscribe( result => {
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
