import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import {
  EditService,
  ExcelExportService,
  FilterService,
  GridModule,
  GroupService,
  PageService,
  SortService,
  ToolbarService,
} from '@syncfusion/ej2-angular-grids';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BreadcrumbModule } from 'xng-breadcrumb';
import { SharedModule } from '../shared/shared.module';
import { BoardComponent } from './components/board/board.component';
import { ListComponent } from './components/list/list.component';
import { CreateTaskModalComponent } from './components/modals/create-task-modal/create-task-modal.component';
import { UserDropdownComponent } from './components/user-dropdown/user-dropdown.component';
import { TasksRoutingModule } from './tasks-routing.module';
import { TasksComponent } from './tasks.component';
@NgModule({
  declarations: [
    TasksComponent,
    ListComponent,
    BoardComponent,
    CreateTaskModalComponent,
    UserDropdownComponent,
  ],
  imports: [
    TasksRoutingModule,
    SharedModule,
  ],
  providers: [
    PageService,
    SortService,
    FilterService,
    GroupService,
    ToolbarService,
    ExcelExportService,
    EditService,
  ],
})
export class TasksModule {}
