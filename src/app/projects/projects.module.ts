import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectsComponent } from './projects.component';
import { ProjectComponent } from './components/project/project.component';
import { ProjectSummaryComponent } from './components/project-summary/project-summary.component';
import { ProjectBoardComponent } from './components/project-board/project-board.component';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { GridModule } from '@syncfusion/ej2-angular-grids';
//import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { PageService, SortService, FilterService, GroupService, ToolbarService, ExcelExportService } from '@syncfusion/ej2-angular-grids';

@NgModule({
  declarations: [
    ProjectsComponent,
    ProjectComponent,
    ProjectSummaryComponent,
    ProjectBoardComponent,
    ProjectListComponent
  ],
  imports: [
    CommonModule,
    GridModule,
    ProjectsRoutingModule,
  ],
  providers: [PageService,
              SortService,
              FilterService,
              GroupService,
              ToolbarService,
              ExcelExportService]
})
export class ProjectsModule { }
