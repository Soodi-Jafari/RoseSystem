import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { LookupValue, GuidLookupValue } from 'src/app/models/lookup-value';
import { Project } from '../../../models/project';
import { ProjectService } from '../../../services/project.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { isNullOrUndefined } from 'util';
import { switchMap, tap, delay, map } from 'rxjs/operators';
import { from } from 'rxjs';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';
import { CustomerService } from '../../../services/customer.service';
import { Customer } from '../../../models/customer';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})

export class ProjectDetailComponent implements OnInit {
  
 @ViewChild("projectList") projectList;
 @ViewChild("list") list;

 viewModel : Project;
 public projects: Array<LookupValue>
 public sourceProjects: Array<LookupValue>
 public sourceCustomers: Array<Customer> 
 public customers: Array<Customer>
 isLoading : boolean;

 constructor(public projectService : ProjectService, public dialogRef: MatDialogRef<ProjectDetailComponent>, public customerService : CustomerService,
                  @Inject(MAT_DIALOG_DATA) public data: any) {
  }

 ngOnInit(){
   this.viewModel = new Project();
   if (!isNullOrUndefined(this.data))
       this.getItem(this.data.id);
   else 
   {
     this.viewModel.isActive = true;
     this.viewModel.inPMISSystem = true;
   }     

   this.getLookups();   
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

     const contains = value => s => s.customerName.toLowerCase().indexOf(value.toLowerCase()) !== -1;
     this.list.filterChange.asObservable().pipe(
           switchMap(value => from([this.sourceCustomers]).pipe(
               tap(() => this.list.loading = true),
               delay(1000),
               map((items) => items.filter(contains(value)))
           ))
       )
       .subscribe(x => {
           this.customers = x;
       });
 }

 getItem(id: number)
 {
   this.isLoading = true;
   this.projectService.getSingle('GetSingle',`${id}`).subscribe((result : any) => {
     this.isLoading = false;
     this.viewModel = result.model;
    }, error => {    
      this.isLoading = false;
  });     
 }

 getLookups()
 {
   this.projectService.getListLookup('PrimaveraProjects').subscribe((data : any) => 
   {
       this.isLoading = false;
       this.projects = this.sourceProjects = data.data;
   }, error => {    
    this.isLoading = false;
});     
   
   this.customerService.getList('AllCustomers').subscribe((result : any) =>     {
    this.customers =  this.sourceCustomers =  result.data;
    this.isLoading = false;
 }, error => {    
  this.isLoading = false;
});     
 }
 
 save()
 {
   if (isNullOrEmptyString(this.viewModel.projectName) || isNullOrUndefined(this.viewModel.projectP3))
            {
                 alert("Please enter required fields!");
                  return;
            }
   this.isLoading = true;
   this.projectService.Post(this.viewModel).subscribe( result => {
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

 onSenderLogoChange(event) {

  let reader = new FileReader(); 
    let file = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.viewModel.senederLogo = reader.result;
      } 
    }
  }
  onRecieverLogoChange(event) {

    let reader = new FileReader(); 
      let file = event.target.files[0];
      if (event.target.files && event.target.files[0]) {
        reader.readAsDataURL(file);
  
        reader.onload = () => {
          this.viewModel.recieverLogo = reader.result;
        } 
      }
    }
}

