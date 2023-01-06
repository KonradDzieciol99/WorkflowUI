import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = 
[
  { 
    path: 'auth', 
    loadChildren: () => import("./authentication/authentication.module").then(mod=>mod.AuthenticationModule),
    data: { showHeader: false, showSidebar: false,showFooter: false },
  },
  {
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    path: 'home', 
    loadChildren: () => import("./home/home.module").then(mod=>mod.HomeModule)
  },

  { path: '**', redirectTo: 'auth', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
