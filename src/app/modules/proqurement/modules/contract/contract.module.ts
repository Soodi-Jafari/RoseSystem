import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractsComponent } from './components/contracts/contracts.component';
import { ContractDetailComponent } from './components/contracts/contract-detail/contract-detail.component';

import { NgxPermissionsService, NgxPermissionsModule } from 'ngx-permissions';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatIconModule, MatListModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatExpansionModule, MatPaginatorModule, MatRadioModule, MatTableModule, MatDatepickerModule, MatNativeDateModule, MatCheckboxModule } from '@angular/material';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule, ExcelModule } from '@progress/kendo-angular-grid';
import { UploadModule } from '@progress/kendo-angular-upload';
import { ContractService } from './services/contract.service';
import { GeneralModule } from 'src/app/modules/general/general.module';
import { ContractItemsComponent } from './components/contract-items/contract-items.component';
import { ContractItemDetailComponent } from './components/contract-items/contract-item-detail/contract-item-detail.component';
import { ContractItemService } from './services/contract-item.service';
import { ContractGuarantiesComponent } from './components/contract-guaranties/contract-guaranties.component';
import { ContractGuarantyDetailComponent } from './components/contract-guaranties/contract-guaranty-detail/contract-guaranty-detail.component';
import { ContractGuarantyService } from './services/contract-guaranty.service';
import { ContractTermPaymentsComponent } from './components/contract-term-payments/contract-term-payments.component';
import { ContractTermPaymentDetailComponent } from './components/contract-term-payments/contract-term-payment-detail/contract-term-payment-detail.component';
import { ContractTermPaymentService } from './services/contract-term-payment.service';
import { VPISDetailComponent } from './components/contract-vpis/vpis-detail/vpis-detail.component';
import { VPISService } from './services/vpis.service';
import { VPISListComponent } from './components/contract-vpis/vpis-list.component';
import { VendorTransmittalsComponent } from './components/vendor-transmittals/vendor-transmittals.component';
import { VendorTransmittalDetailComponent } from './components/vendor-transmittals/vendor-transmittal-detail/vendor-transmittal-detail.component';
import { VendorTransmittalDocsComponent } from './components/vendor-transmittal-docs/vendor-transmittal-docs.component';
import { VendorTransmitalDocDetailComponent } from './components/vendor-transmittal-docs/vendor-transmital-doc-detail/vendor-transmital-doc-detail.component';
import { VendorTransmittalService } from './services/vendor-transmittal.service';
import { VendorTransmittalDocService } from './services/vendor-transmittal-doc.service';
import { VdrComponent } from './components/vdr/vdr.component';
import { VandorDocumentsComponent } from './components/vandor-documents/vandor-documents.component';
import { VpisReportComponent } from './components/vpis-report/vpis-report.component';

@NgModule({
  declarations: [
    ContractsComponent,
    ContractDetailComponent,
    ContractItemsComponent,
    ContractItemDetailComponent,
    ContractGuarantiesComponent,
    ContractGuarantyDetailComponent,
    ContractTermPaymentsComponent,
    ContractTermPaymentDetailComponent,
    VPISListComponent,
    VPISDetailComponent,
    VendorTransmittalsComponent,
    VendorTransmittalDetailComponent,
    VendorTransmittalDocsComponent,
    VendorTransmitalDocDetailComponent,
    VdrComponent,
    VandorDocumentsComponent,
    VpisReportComponent,
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
    NgxPermissionsModule
  ],
  exports: [
    ContractsComponent
  ], 
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
],
  entryComponents: [
    ContractDetailComponent,
    ContractItemsComponent,
    ContractItemDetailComponent,
    ContractGuarantiesComponent,
    ContractGuarantyDetailComponent,
    ContractTermPaymentsComponent,
    ContractTermPaymentDetailComponent,
    VPISListComponent,
    VPISDetailComponent,
    VendorTransmittalDetailComponent,
    VendorTransmittalDocsComponent,
    VendorTransmitalDocDetailComponent
  ],
  providers: [
    NgxPermissionsService,
    ContractService,
    ContractItemService,
    ContractGuarantyService,
    ContractTermPaymentService,
    VPISService,
    VendorTransmittalService,
    VendorTransmittalDocService
  ]
})
export class ContractModule { }
