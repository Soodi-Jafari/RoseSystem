import { Project } from "src/app/models/project";
import { Observer } from './observer';
import { Injectable } from '@angular/core';
import { isNullOrUndefined } from 'util';

@Injectable()
export class Subject {
	
  //private List<Observer> observers = new arr<Observer>();
  private observer : Observer;
  private state : Project;
  public projectId : string;

  public getState() : Project {
     return this.state;
  }

  public setState(project : Project) {
     this.state = project;
     this.notifyAllObservers();
  }

  public attach(observer : Observer){    
         this.observer = observer;		
  }

  public notifyAllObservers(){    
     if (!isNullOrUndefined(this.observer)) 
         this.observer.refresh();
     }
  } 	