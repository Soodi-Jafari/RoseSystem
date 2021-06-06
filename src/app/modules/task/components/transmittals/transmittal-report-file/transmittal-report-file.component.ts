import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/modules/baseinfo/models/project';
import { Transmittal } from '../../../models/transmittal';
import { ProjectService } from 'src/app/modules/baseinfo/services/project.service';
import { TransmittalService } from '../../../services/transmittal.service';
import { EnumCoding } from 'src/app/modules/general/enums/enum-coding';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-transmittal-report-file',
  templateUrl: './transmittal-report-file.component.html',
  styleUrls: ['./transmittal-report-file.component.css']
})
export class TransmittalReportFileComponent implements OnInit {

  isLoading : boolean;
  project: Project;
  transmittal: Transmittal;
  filename: string;
  filenameExcel: string;
  senderName: string;
  excellData: any[];
  excellHeader: string;
  constructor(public projectService : ProjectService, public transmittalService : TransmittalService,private route: ActivatedRoute) { 

    this.transmittal = new Transmittal();
    this.transmittal.id = parseInt(this.route.snapshot.paramMap.get('transmittalId'))
    this.transmittal.projectId = this.route.snapshot.paramMap.get('peojectId')
  }
 
  ngOnInit() {
    this.filename = "TransmittalDocuments";
    this.project = new Project();
 
    this.getOrgPositions();
    this.getProject();
    this.getTransmittal();
  }

  getProject()
  {
    this.projectService.getSingle('SingleProject',`${this.transmittal.projectId}`).subscribe((result : any) => {
      this.project = result.model;
     });
  }

  getTransmittal()
  {
    this.isLoading = true;
    this.transmittalService.getSingle('GetSingle',`${this.transmittal.id}`).subscribe((result : any) => {
      this.isLoading = false;
      this.transmittal = result.model;
      this.filename = this.transmittal.transmittalNo + ".pdf";
      this.filenameExcel= this.transmittal.transmittalNo + ".xlsx";
      this.excellHeader = "Transmittal No: " + this.transmittal.transmittalNo + "         Transmittal Date: " +
          new Date(this.transmittal.transmittalDate).toLocaleDateString()  +  "         Sender: ROSEMOND    " + "         Reciever: " + this.transmittal.customer.title 

      this.setExcellData();
     }, error => {    
      this.isLoading = false;
    });  
  }

  getTransmittalPageType(id: number)
  {
    if (id > 0)
      return EnumCoding.PageTypes.find((t : any) => t.id == id).title;
  }


  getOrgPositions()
  { 
    this.transmittalService.getOrganizationEngineeringManager().subscribe( (result : any) =>  {
          this.senderName = result.model.name
      });
  }

  print() {
    window.print();
   return false;
 }
 
setExcellData()
{
   this.excellData = this.transmittal.transmittalDocuments.map((item : any) => {
    return { 
      documentNo : item.documentNo,
      revision : item.revision,
      documentTitle : item.documentTitle,
      sheetNo : item.sheetNo,
      pageType : this.getTransmittalPageType(item.pageType),
      purposeOfIssue: item.purposeOfIssue.title  
    };

  });
}



}
