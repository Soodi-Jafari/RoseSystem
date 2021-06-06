import { Component, OnInit } from '@angular/core';
import { TimesheetService } from '../../services/timesheet.service';

@Component({
  selector: 'app-peosonnels-on-off',
  templateUrl: './peosonnels-on-off.component.html',
  styleUrls: ['./peosonnels-on-off.component.css']
})
export class PeosonnelsOnOffComponent implements OnInit {

  isLoading: boolean;
  personnels: any[];
  personnels1: any[];
  personnels2: any[];
  personnels3: any[];
  personnels4: any[];
  personnels5: any[];
  personnels6: any[];
  constructor(public timeService: TimesheetService) { }

  ngOnInit() {

    this.getAttendance();
  }

  getAttendance(): void {

    this.isLoading = true;
    this.timeService.getPersonnelOnOff()
      .subscribe((result: any) => {
        this.isLoading = false;
        this.personnels = result.data;
        var take = Math.round(this.personnels.length / 6);
        this.personnels1= this.personnels.slice(0, take);
        this.personnels2= this.personnels.slice(take, take * 2 );
        this.personnels3= this.personnels.slice(take * 2, take * 3 );
        this.personnels4= this.personnels.slice(take * 3, take * 4 );
        this.personnels5= this.personnels.slice(take * 4, take * 5 );
        this.personnels6= this.personnels.slice(take * 5, this.personnels.length);

      }, error => {
        this.isLoading = false;
      });
  }

  setTimeFormat(time: number) {
    if (time > 0) {
      var x = (time.toString().length == 3 ? "0" : "") + Math.floor(time / 100).toString() + ":" + ((time % 100).toString().length == 1 ? "0" : "") + (time % 100).toString();
      return "   (" + x + ")   ";
    }
    return ""
  }
}
