import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = 
[
  {
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    path: 'messages', 
    loadChildren: () => import("./messages/messages.module").then(mod=>mod.MessagesModule)
  },
  {
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    path: 'projects', 
    loadChildren: () => import("./projects/projects.module").then(mod=>mod.ProjectsModule)
  },
  //{ path: '**', redirectTo: 'auth', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
