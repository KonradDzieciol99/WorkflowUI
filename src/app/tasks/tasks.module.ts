import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TasksRoutingModule } from './tasks-routing.module';
import { TasksComponent } from './tasks.component';
import { SummaryComponent } from './components/summary/summary.component';
import { ListComponent } from './components/list/list.component';
import { BoardComponent } from './components/board/board.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    TasksComponent,
    SummaryComponent,
    ListComponent,
    BoardComponent,
    SidebarComponent
  ],
  imports: [
    CommonModule,
    TasksRoutingModule,
    NgbCollapseModule
  ]
})
export class TasksModule { }
