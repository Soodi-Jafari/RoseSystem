import { Component, OnInit, NgZone } from '@angular/core';
import { Observer } from '../home/observer/observer';
import { Subject } from '../home/observer/subject';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit,Observer {

  constructor(public subject: Subject
    //private _signalRService: SignalrService, private _ngZone: NgZone
    ) {
    this.subject.attach(this);

  /*   this.subscribeToEvents();  
    // this can check for conenction exist or not.  
    this.canSendMessage = _signalRService.connectionExists;  
    // this method call every second to tick and respone tansfered to client.  
    setInterval(() => {  
        this._signalRService.sendTime();  
    }, 1000);  */
}

  ngOnInit() {
  }

  refresh(): void {  
   }

 /*   // trst signalr
   public currentMessage: GetClockTime;  
   public allMessages: GetClockTime;  
   public canSendMessage: Boolean;  
   // constructor of the class to inject the service in the constuctor and call events.  

   private subscribeToEvents(): void {  
       // if connection exists it can call of method.  
       this._signalRService.connectionEstablished.subscribe(() => {  
           this.canSendMessage = true;  
       });  
       // finally our service method to call when response received from server event and transfer response to some variable to be shwon on the browser.  
       this._signalRService.messageReceived.subscribe((message: GetClockTime) => {  
           debugger;  
           this._ngZone.run(() => {  
               this.allMessages = message;  
           });  
       });  
   }   */
}
