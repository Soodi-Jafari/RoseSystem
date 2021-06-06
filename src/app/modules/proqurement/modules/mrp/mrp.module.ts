import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MrpDetailComponent } from './components/mrp-detail/mrp-detail.component';
import { MrpitemsComponent } from './components/mrpitems/mrpitems.component';
import { MrpitemDetailComponent } from './components/mrpitems/mrpitem-detail/mrpitem-detail.component';
import { MrpItemsModalComponent } from './components/mrpitems/mrp-items-modal/mrp-items-modal.component';
import { MrpvendorsComponent } from './components/mrpvendors/mrpvendors.component';
import { MrpvendorDetailComponent } from './components/mrpvendors/mrpvendor-detail/mrpvendor-detail.component';
import { MrpdocumentsComponent } from './components/mrpdocuments/mrpdocuments.component';
import { MrpdocumentDetailComponent } from './components/mrpdocuments/mrpdocument-detail/mrpdocument-detail.component';
import { MrpvendorflowsComponent } from './components/mrpvendorflows/mrpvendorflows.component';
import { MrpvendorflowDetailComponent } from './components/mrpvendorflows/mrpvendorflow-detail/mrpvendorflow-detail.component';
import { TbesComponent } from './components/tbes/tbes.component';
import { CbesComponent } from './components/cbes/cbes.component';
import { MrpsComponent } from './components/mrps.component';
import { NgxPermissionsService, NgxPermissionsModule } from 'ngx-permissions';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatIconModule, MatListModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatExpansionModule, MatPaginatorModule, MatRadioModule, MatTableModule, MatDatepickerModule, MatNativeDateModule, MatCheckboxModule } from '@angular/material';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule, ExcelModule } from '@progress/kendo-angular-grid';
import { UploadModule } from '@progress/kendo-angular-upload';
import { MRPService } from './services/mrp.service';
import { CBEService } from './services/cbe.service';
import { MRPDocumentService } from './services/mrp-document.service';
import { MRPItemService } from './services/mrp-item.service';
import { MRPVendorFlowService } from './services/mrp-vendor-flow.service';
import { MRPVendorService } from './services/mrp-vendor.service';
import { TBEService } from './services/tbe.service';
import { GeneralModule } from 'src/app/modules/general/general.module';
import { VendorOffersComponent } from './components/vendor-offers/vendor-offers.component';
import { VendorFlowDeleyReportComponent } from './components/vendor-flow-deley-report/vendor-flow-deley-report.component';

@NgModule({
  declarations: [
    MrpsComponent,
    MrpDetailComponent,
    MrpitemsComponent,
    MrpitemDetailComponent,
    MrpItemsModalComponent,
    MrpvendorsComponent,
    MrpvendorDetailComponent,
    MrpdocumentsComponent,
    MrpdocumentDetailComponent,
    MrpvendorflowsComponent,
    MrpvendorflowDetailComponent,    
    TbesComponent,
    CbesComponent,    
    VendorOffersComponent,
    VendorFlowDeleyReportComponent

  ],
  imports: [
    CommonModule,
    GeneralModule,

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
  ],
  exports: [
    MrpsComponent,
   // MrpvendorflowDetailComponent,
    //MrpvendorflowsComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
],

  entryComponents: [
    MrpDetailComponent,
    MrpItemsModalComponent,
    MrpitemDetailComponent,
    MrpvendorsComponent,
    MrpvendorDetailComponent,
    MrpdocumentsComponent,
    MrpdocumentDetailComponent,   
    TbesComponent,
    CbesComponent,

  ],
  providers: [
    NgxPermissionsService,
    MRPService,
    CBEService,
    MRPDocumentService,
    MRPItemService,
    MRPVendorFlowService,
    MRPVendorService,
    TBEService
  ],
})
export class MrpModule { }
