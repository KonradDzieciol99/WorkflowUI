import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';
import { ProjectSideBarComponent } from './components/project-side-bar/project-side-bar.component';
import { ProjectsComponent } from './projects.component';
import { SettingsComponent } from './components/settings/settings.component';

const routes: Routes = [
  {
    path: '',
    canActivateChild: [AuthGuard],
    children: [
      { path: '', component: ProjectsComponent },
      {
        path: ':id',
        component: ProjectSideBarComponent,
        data: { breadcrumb: { alias: 'projectSideBar' } },
        children: [
          {
            path: 'tasks',
            loadChildren: () =>
              import('../tasks/tasks.module').then((m) => m.TasksModule),
          },
          { path: 'settings', component: SettingsComponent },
          { path: '**', redirectTo: 'tasks', pathMatch: 'full' },
        ],
      },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectsRoutingModule {}
