import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksRoutingModule } from './tasks-routing.module';
import { TasksComponent } from './tasks.component';
import { SummaryComponent } from './components/summary/summary.component';
import { ListComponent } from './components/list/list.component';
import { BoardComponent } from './components/board/board.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { EditService, GridModule } from '@syncfusion/ej2-angular-grids';
import { PageService, SortService, FilterService, GroupService, ToolbarService, ExcelExportService } from '@syncfusion/ej2-angular-grids';
import { SharedModule } from '../shared/shared.module';
@NgModule({
  declarations: [
    TasksComponent,
    SummaryComponent,
    ListComponent,
    BoardComponent,
    SidebarComponent,
    CreateTaskModalComponent,
    UserDropdownComponent
  ],
  imports: [
    CommonModule,
    TasksRoutingModule,
    NgbCollapseModule,
    GridModule,
    SharedModule,
    NgbCollapseModule,
    BsDropdownModule.forRoot(),
    ButtonsModule.forRoot(),
    BreadcrumbModule,
    TooltipModule.forRoot(),

  ],
  providers: [PageService,
    SortService,
    FilterService,
    GroupService,
    ToolbarService,
    ExcelExportService,
    EditService,]
})
export class TasksModule { }import { InputCustomComponent } from '../shared/components/input-custom/input-custom.component';
import { CreateTaskModalComponent } from './components/modals/create-task-modal/create-task-modal.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { UserDropdownComponent } from './components/user-dropdown/user-dropdown.component';
import { BreadcrumbModule } from 'xng-breadcrumb';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

