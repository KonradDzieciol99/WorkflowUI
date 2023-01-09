import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';
import { MessagesComponent } from './messages.component';

const routes: Routes = [
  {
    path: '',
    canActivateChild:[AuthGuard],
    component: MessagesComponent,
    // children: [
    //   //{ path: '', component: MessagesComponent },

    // ]
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MessagesRoutingModule { }
