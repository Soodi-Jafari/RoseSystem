import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material';
import { isNullOrUndefined } from 'util';
import { EnumCoding } from 'src/app/modules/general/enums/enum-coding';

@Component({
  selector: 'app-event-states-log',
  templateUrl: './event-states-log.component.html',
  styleUrls: ['./event-states-log.component.css']
})
export class EventStatesLogComponent implements OnInit {
  
  @Input() public approvalStates: [];
  @ViewChild('stepper') stepper: MatStepper;

  constructor() {

   }

  public ngOnInit(): void {
   
  }

   getStateTitle(id)
   {
     if (!isNullOrUndefined(id))
          return EnumCoding.EventStatus.find((t : any) => t.id == id).title;    
   }


}
