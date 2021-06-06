import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './loading/loading.component';
import { CommaSeperatedPipe } from './pipes/comma-seperated.pipe';
import { AttachFileComponent } from '../proqurement/components/attach-file/attach-file.component';
import { MatButtonModule, MatIconModule, MatListModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatExpansionModule, MatPaginatorModule, MatRadioModule, MatTableModule, MatDatepickerModule, MatNativeDateModule, MatCheckboxModule, MatStepperModule, MatTooltipModule } from '@angular/material';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule, ExcelModule } from '@progress/kendo-angular-grid';
import { UploadModule } from '@progress/kendo-angular-upload';
import { NgxPermissionsService, NgxPermissionsModule } from 'ngx-permissions';
import { VDRService } from '../proqurement/modules/contract/services/vdr.service';
import { StateAttachFilesComponent } from '../proqurement/components/approval-flow-components/state-attach-files.component';
import { ApprovalFlowLogComponent } from '../proqurement/components/approval-flow-components/approval-flow-log.component';
import { IdcDetailComponent } from '../proqurement/components/idcs/idc-detail/idc-detail.component';
import { IdcDisciplinesComponent } from '../proqurement/components/idcs/idc-disciplines.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IdcService } from '../proqurement/services/idc.service';

@NgModule({
  declarations: [
    LoadingComponent,
    CommaSeperatedPipe,
    AttachFileComponent,
    StateAttachFilesComponent,
    ApprovalFlowLogComponent,    
    IdcDetailComponent,   
    IdcDisciplinesComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
 ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatRadioModule,
    DropDownsModule,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    GridModule,
    ExcelModule,
    UploadModule,
    NgxPermissionsModule,
    MatStepperModule,
    MatTooltipModule,
  ],
  exports: [
     LoadingComponent,
     CommaSeperatedPipe,
     AttachFileComponent,
     StateAttachFilesComponent,
     ApprovalFlowLogComponent,
     IdcDetailComponent,   
     IdcDisciplinesComponent
    ],

    providers: [
      NgxPermissionsService,
      VDRService,
      IdcService,
    ],

})
export class GeneralModule { }
