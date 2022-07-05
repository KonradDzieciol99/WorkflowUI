import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorizationGuard } from './guards/authorization.guard';
import { AuthComponent } from './layouts/auth/auth.component';
import { InsideComponent } from './layouts/inside/inside.component';
import { TeamHomeResolver } from './resolvers/team-home.resolver';
import { LoginComponent } from './views/auth/login/login.component';
import { RegisterComponent } from './views/auth/register/register.component';
import { DashboardComponent } from './views/inside/dashboard/dashboard.component';
import { ListComponent } from './views/inside/list/list.component';
import { TeamHomeComponent } from './views/inside/team-home/team-home.component';
import { TeamsManagmentComponent } from './views/inside/teams-managment/teams-managment.component';

const routes: Routes = [

  {
    path: "inside",
    component: InsideComponent, runGuardsAndResolvers: 'always', canActivate: [AuthorizationGuard],
    children: [

      { path: "teams-managment", component: TeamsManagmentComponent,
      children:[]
      },
      { path: "team-home/:id",  resolve: {team: TeamHomeResolver}, component: TeamHomeComponent,
      children:[
        { path: "dashboard", component: DashboardComponent},
        { path: "list", component: ListComponent},
        { path: "", redirectTo: "dashboard", pathMatch: "full" },

        
      ]},
      { path: "", redirectTo: "teams-managment", pathMatch: "full" },
    ],
  },
  {
    path: "auth",
    component: AuthComponent,
    children: [
      { path: "login", component: LoginComponent },
      { path: "register", component: RegisterComponent },
      { path: "", redirectTo: "login", pathMatch: "full" },
    ],
  },
  { path: "", redirectTo: "auth", pathMatch: "full" },
  { path: "**", redirectTo: "auth", pathMatch: "full" },
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
