import { Component, OnInit, Inject } from '@angular/core';
import { PCTCondition } from '../../../models/pct-level';
import { LookupValue } from 'src/app/models/lookup-value';
import { PCTService } from '../../../services/pct.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { isNullOrUndefined, debug } from 'util';
import { EnumCoding } from 'src/app/modules/general/enums/enum-coding';

@Component({
  selector: 'app-pct-condition',
  templateUrl: './pct-condition.component.html',
  styleUrls: ['./pct-condition.component.css']
})
export class PctConditionComponent implements OnInit {
  
 viewModel : PCTCondition;
 conditionFeilds: any[];
 conditionOprands: any[];
 units: Array<LookupValue>
 documentStatus: Array<LookupValue>
 documentTypes: Array<LookupValue>
 isLoading : boolean;
 isValuList: boolean;

 constructor(public itemService : PCTService, public dialogRef: MatDialogRef<PctConditionComponent>,
                  @Inject(MAT_DIALOG_DATA) public data: any) {
           
  }

 ngOnInit(){

   this.conditionFeilds = EnumCoding.ConditionFeilds;
   this.conditionOprands = EnumCoding.ConditionOprands;
   this.isValuList = false;
   this.viewModel = new PCTCondition();
   if (!isNullOrUndefined(this.data))
      this.viewModel = this.data;
   else
      this.viewModel.conditionOprand = 1;   

   this.getLookups();   
 }

 getLookups()
 {
   this.isLoading = true;
   this.itemService.getListLookup('DocumentStatuse').subscribe((data : any) => 
   {
       this.isLoading = false;
       this.documentStatus  = data.documentStatus;   
       this.documentTypes = data.documentType;
   }, error => {    
    this.isLoading = false;
});     
 }
 
 save()
 {
   if ( isNullOrUndefined(this.viewModel.conditionOprand)
            || isNullOrUndefined(this.viewModel.feild))
            {
                 alert("Please enter required fields!");
                  return;

            }
    if (this.viewModel.feild ==1 || this.viewModel.feild == 2)  
    {
      if ( isNullOrUndefined(this.viewModel.lookupValue))
      {
           alert("Please enter required fields!");
            return;
      }
      this.viewModel.value = this.viewModel.lookupValue.title;
    }   
    else
    {
      if ( isNullOrUndefined(this.viewModel.value))
      {
           alert("Please enter required fields!");
            return;
      }
    }
           
   this.dialogRef.close(this.viewModel);

 }

 closeDialog() {
   this.dialogRef.close();
 }

 onConditionFeildChange(id)
 {
    var value = parseInt(id)
    if (value == 1 || value == 2)
    {
      this.isValuList = true;
      if (value == 1)
         this.units = this.documentStatus;
      if (value == 2)
         this.units = this.documentTypes;
    }
    else
       this.isValuList = false;
 }
}
