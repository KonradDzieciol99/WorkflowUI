import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';
import { HomeComponent } from './home.component';

const routes: Routes = [

  {
    path: '',
    canActivateChild:[AuthGuard],
    children: [
      { path: '', component: HomeComponent },

    ]
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
