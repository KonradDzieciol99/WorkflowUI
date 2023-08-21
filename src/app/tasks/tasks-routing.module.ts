import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';
import { BoardComponent } from './components/board/board.component';
import { ListComponent } from './components/list/list.component';
import { SummaryComponent } from './components/summary/summary.component';

const routes: Routes = [
  {
    path: '',
    children: [
      // { path: 'summary', component: SummaryComponent,},
      // { path: 'board', component: BoardComponent,},
      { path: 'list', component: ListComponent,},
      { path: '**', redirectTo: 'list', pathMatch: 'full' },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TasksRoutingModule { }



