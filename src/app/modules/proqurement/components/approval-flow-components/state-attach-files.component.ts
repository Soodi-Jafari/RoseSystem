import { Component, Input, OnInit } from '@angular/core';
import { GridDataResult} from '@progress/kendo-angular-grid';
import { GlobalConfigService } from 'src/app/services/global-config.service';
import { State,process } from '@progress/kendo-data-query';

@Component({
    selector: 'state-attach-files',
    template: `
   
  `
})
export class StateAttachFilesComponent implements OnInit {

    /**
     * The category for which details are displayed
     */
    @Input() public attachFiles: [];

    public gridView: GridDataResult;
    public state: State = {
      skip: 0,
      take: 10
        
     };

    constructor(private globalConfigService : GlobalConfigService) { }

    public ngOnInit(): void {
        this.gridView = process(this.attachFiles,this.state);
    }

    getPath(file : any)
    {
      return this.globalConfigService.apiUrl + '/' + file.path;
    }
  
    fileSizeFormat(size: number)
    {
       var s = Math.round(size/1000)
       return s.toString() + 'K';
     }
}
