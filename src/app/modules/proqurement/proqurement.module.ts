import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItemsComponent } from './components/items/items.component';
import { ItemDetailComponent } from './components/items/item-detail/item-detail.component';
import { VendorDetailComponent } from './components/vendors/vendor-detail/vendor-detail.component';
import { VendorsComponent } from './components/vendors/vendors.component';
import { VendorItemsComponent } from './components/vendors/vendor-items.component';

import { NgxPermissionsService, NgxPermissionsModule } from 'ngx-permissions';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatIconModule, MatListModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatExpansionModule, MatPaginatorModule, MatRadioModule, MatTableModule, MatDatepickerModule, MatNativeDateModule, MatCheckboxModule, MatTabsModule, MatStepperModule, MatTooltip } from '@angular/material';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule, ExcelModule } from '@progress/kendo-angular-grid';
import { UploadModule } from '@progress/kendo-angular-upload';
import { ItemService } from './services/item.service';
import { VendorService } from './services/vendor.service';
import { GeneralModule } from '../general/general.module';
import { ContractModule } from './modules/contract/contract.module';
import { MrpModule } from './modules/mrp/mrp.module';
import { IdcsComponent } from './components/idcs/idcs.component';
import { MRPVendorFlowService } from './modules/mrp/services/mrp-vendor-flow.service';
import { VdrCartableComponent } from './components/vendorflow-cartable/vdr-cartable/vdr-cartable.component';
import { VDRService } from './modules/contract/services/vdr.service';
import { VendorflowCartableComponent } from './components/vendorflow-cartable/vendorflow-cartable.component';
import { VorCartableComponent } from './components/vendorflow-cartable/vor-cartable/vor-cartable.component';
import { IdcCartableComponent } from './components/vendorflow-cartable/idc-cartable/idc-cartable.component';

@NgModule({
  declarations: [
    VendorsComponent,
    VendorDetailComponent,
    VendorItemsComponent,
    ItemsComponent,
    ItemDetailComponent,
    IdcsComponent,
    VdrCartableComponent, 
    VendorflowCartableComponent,  
    VorCartableComponent,
    IdcCartableComponent
  ],
  imports: [
    CommonModule,
    MrpModule,
    ContractModule,
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
    MatTabsModule,
  ],
  exports: [
    VendorsComponent,
    ItemsComponent,
  ],
  entryComponents: [
    VendorDetailComponent,
    ItemDetailComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
],
  providers: [
    NgxPermissionsService,
    ItemService,
    VendorService,
    MRPVendorFlowService,
    VDRService,
  ]
})
export class ProqurementModule { }
