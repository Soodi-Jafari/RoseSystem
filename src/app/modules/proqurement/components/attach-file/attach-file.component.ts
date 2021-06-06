import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { State,process } from '@progress/kendo-data-query';
import { AttachFile } from 'src/app/models/attach-file';
import { SuccessEvent, FileRestrictions } from '@progress/kendo-angular-upload';
import * as _ from 'lodash';
import { GlobalConfigService } from 'src/app/services/global-config.service';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-attach-file',
  templateUrl: './attach-file.component.html',
  styleUrls: ['./attach-file.component.css']
})

export class AttachFileComponent implements OnInit {

  @Input() public attachFiles: AttachFile[];
  @Input() public uploadSaveUrl: string;
  @Input() public disabled: boolean;
  @Output() attachFileChanged = new EventEmitter<AttachFile[]>();

  myRestrictions: FileRestrictions = {
    maxFileSize: 500000000
  };
  
  public fileGridView: GridDataResult;
  public state: State = {
    skip: 0,
    take: 5      
  };

  constructor(private globalConfigService : GlobalConfigService) {

   }

  public ngOnInit(): void {
      this.setGrid();
  }

  ngOnChanges(changes: SimpleChanges) {
      this.setGrid();
  }

  private setGrid(): void {    
    this.fileGridView = process(this.attachFiles,this.state);
   }
     
 public dataStateChange(state: DataStateChangeEvent): void {
  this.state = state;
  this.setGrid();
   }

   fileSizeFormat(size: number)
   {
      var s = Math.round(size/1000)
      return s.toString() + 'K';
    }
    
    getPath(file : AttachFile)
    {
      return this.globalConfigService.apiUrl + '/' + file.path;
    }
   successEventHandler(e: SuccessEvent) {

    var attachFile = new AttachFile();
    attachFile.fileName = e.files[0].name;
    attachFile.fileSize = e.files[0].size;
    attachFile.path = e.response.body.url;
    this.attachFiles.push(attachFile);
    this.setGrid();
    this.attachFileChanged.emit(this.attachFiles);
  } 
  errorEventHandler($event)
  {
    debugger;
  }  
  deleteFile(row: any)
  {   
     if(confirm(`Are you sure to delete  "${row.fileName}"`)) {
      _.remove(this.attachFiles,function(n) {
        return n == row;
          });
         this.setGrid(); 
         this.attachFileChanged.emit(this.attachFiles);       
      }
    }
}
