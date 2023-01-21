import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CallbackComponent } from './authentication/callback/callback.component';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = 
[
 
  {path: 'testauth', component: CallbackComponent},
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
  {
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    path: 'messages', 
    loadChildren: () => import("./messages/messages.module").then(mod=>mod.MessagesModule)
  },
  { path: '**', redirectTo: 'auth', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
