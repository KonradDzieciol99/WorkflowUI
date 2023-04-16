import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectsComponent } from './projects.component';
import { ProjectSideBarComponent } from './components/project-side-bar/project-side-bar.component';
import { ProjectSummaryComponent } from './components/project-summary/project-summary.component';
import { ProjectBoardComponent } from './components/project-board/project-board.component';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { EditService, GridModule } from '@syncfusion/ej2-angular-grids';
//import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { PageService, SortService, FilterService, GroupService, ToolbarService, ExcelExportService } from '@syncfusion/ej2-angular-grids';
import { CreateProjectModalComponent } from './components/modals/create-project-modal/create-project-modal.component';
import { SharedModule } from '../shared/shared.module';
import { IconPickerComponent } from './components/icon-picker/icon-picker.component';
import { FindLeaderPipe } from './pipes/find-leader.pipe';
import { CollapseModule } from 'ngx-bootstrap/collapse';

@NgModule({
  declarations: [
    ProjectsComponent,
    ProjectSideBarComponent,
    ProjectSummaryComponent,
    ProjectBoardComponent,
    ProjectListComponent,
    CreateProjectModalComponent,
    IconPickerComponent,
    FindLeaderPipe
  ],
  imports: [
    CommonModule,
    GridModule,
    ProjectsRoutingModule,
    SharedModule,
    CollapseModule.forRoot(),
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
