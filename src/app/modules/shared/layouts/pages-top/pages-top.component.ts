import { Component } from '@angular/core';
import { GlobalService } from '../../services/global.service';
import { Project } from 'src/app/models/project';
import { NgxPermissionsService } from 'ngx-permissions';
import { CommonService } from 'src/app/services/common.service';
import { AuthService } from 'src/app/auth/auth.service';
import { isNullOrUndefined } from 'util';

import * as _ from 'lodash';
import { UserRolePermission } from 'src/app/modules/general/user-role-permission';
import { Subject } from 'src/app/home/observer/subject';

@Component({
  selector: 'pages-top',
  templateUrl: './pages-top.component.html',
  styleUrls: ['./pages-top.component.scss'],
})

export class PagesTopComponent {

  public show: boolean = false;
  sidebarToggle: boolean = true;
  tip = { ring: true, email: true };
  public projects: Array<Project>
  public selectedProject : Project;
  currentUser : any;
  orgRolePermission : string[];

  constructor(private permissionsService: NgxPermissionsService,private _globalService: GlobalService,
    public subject: Subject, public commonService : CommonService,
    private authService : AuthService) {
      this.currentUser = {};
  }

  ngOnInit(): void {
    this.setUserName();    
  }

  getProjectsLookup()
  {
    this.commonService.GetAllProjects().subscribe((result : any) =>     {
       this.projects = result.data;
       if ( !isNullOrUndefined(this.projects) && this.projects.length > 0)
        {
            if (!isNullOrUndefined(this.subject.projectId))
               this.selectedProject = _.find(this.projects,(item:any) => item.id == this.subject.projectId);
            else
               this.selectedProject = this.projects[0];
            this.subject.setState(this.selectedProject);
            this.commonService.CurrentProject = this.selectedProject;
            this.setPermissions();
         }
         else{
            this.setPermissions();
         }
    });
  }

  setUserName()
  {
    this.authService.getLoggedIn().subscribe((result : any) => {
           this.currentUser = result;
           this.GetUserOrganizationRole();
           setTimeout(()=>{   
            this.getProjectsLookup();
       }, 2000);
           
    })
  }

  public selectionChange(value: any): void {
    this.selectedProject = value;
    this.commonService.CurrentProject = this.selectedProject;
    this.subject.setState(this.selectedProject);
    // if (!isNullOrUndefined(this.selectedProject))
       this.setPermissions();
    // else
    //    this.clearPermission();   
  }

  setPermissions()
  {
     var allPerm : string[] = [];
     allPerm.push("")
     if (!isNullOrUndefined(this.selectedProject))
     {
      _.forEach(this.selectedProject.roles, (role : any) => {
          var perms = UserRolePermission.GetRolPermissions(role.positionId);    
          allPerm =  _.concat(allPerm,perms);
       })
      }
      allPerm =  _.concat(allPerm,this.orgRolePermission);
      this.permissionsService.loadPermissions(allPerm);
  }

  clearPermission()
  {
    this.permissionsService.flushPermissions();
  }
  
  logout()
  {
    this.show = false;
    this.clearPermission();
    this.authService.logout(false);  
  }

  public _sidebarToggle() {
    this._globalService.data$.subscribe(data => {
      if (data.ev === 'sidebarToggle') {
        this.sidebarToggle = data.value;
      }
    }, error => {
      console.log('Error: ' + error);
    });
    this._globalService.dataBusChanged('sidebarToggle', !this.sidebarToggle);
  }
  
  public onToggle(): void {
    this.show = !this.show;
}

GetUserOrganizationRole()
{
  this.orgRolePermission = [];
  this.commonService.GetUserOrganizationRole().subscribe((result : any) =>     {
    _.forEach( result.data, (role : any) => {
      var perms = UserRolePermission.GetRolPermissions(role.id);    
      this.orgRolePermission =  _.concat(this.orgRolePermission,perms);
   })
 });
}

}
