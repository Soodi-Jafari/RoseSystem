import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedModule } from './shared.module';

import { GlobalService } from './services/global.service';

import { NotificationComponent } from './components/notification/notification.component';
import { LoadingComponent } from './components/loading/loading.component';
import { MenuComponent } from './layouts/menu/menu.component';
import { SidebarComponent } from './layouts/sidebar/sidebar.component';
import { ContentTopComponent } from './layouts/content-top/content-top.component';
import { PagesTopComponent } from './layouts/pages-top/pages-top.component';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { NgxPermissionsService, NgxPermissionsModule } from 'ngx-permissions';
import { FormsModule } from '@angular/forms';
import { PopupModule } from '@progress/kendo-angular-popup';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        SharedModule,
        FormsModule,
        DropDownsModule,
        PopupModule,
        NgxPermissionsModule.forRoot()
    ],
    providers: [
        GlobalService,
        NgxPermissionsService,
    ],
    declarations: [
        MenuComponent,
        SidebarComponent,
        PagesTopComponent,
        ContentTopComponent,
        NotificationComponent,
        LoadingComponent
    ],
    exports: [
        SidebarComponent,
        PagesTopComponent,
        ContentTopComponent,
        NotificationComponent,
        LoadingComponent
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
     ],
})
export class LayoutModule { }
