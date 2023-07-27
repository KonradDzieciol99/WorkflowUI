import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectsComponent } from './projects.component';
import { ProjectSideBarComponent } from './components/project-side-bar/project-side-bar.component';
import { EditService, GridModule } from '@syncfusion/ej2-angular-grids';
import { PageService, SortService, FilterService, GroupService, ToolbarService, ExcelExportService } from '@syncfusion/ej2-angular-grids';
import { CreateProjectModalComponent } from './components/modals/create-project-modal/create-project-modal.component';
import { SharedModule } from '../shared/shared.module';
import { IconPickerComponent } from './components/icon-picker/icon-picker.component';
import { FindLeaderPipe } from './pipes/find-leader.pipe';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { SettingsComponent } from './components/settings/settings.component';
import { BreadcrumbModule } from 'xng-breadcrumb';

@NgModule({
  declarations: [
    ProjectsComponent,
    ProjectSideBarComponent,
    CreateProjectModalComponent,
    IconPickerComponent,
    FindLeaderPipe,
    SettingsComponent,
    
  ],
  imports: [
    CommonModule,
    GridModule,
    ProjectsRoutingModule,
    SharedModule,
    NgbCollapseModule,
    BreadcrumbModule
  ],
  providers: [PageService,
              SortService,
              FilterService,
              GroupService,
              ToolbarService,
              ExcelExportService,
              EditService,]
})
export class ProjectsModule { }
