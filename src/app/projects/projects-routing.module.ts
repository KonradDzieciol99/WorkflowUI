import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';
import { ProjectBoardComponent } from './components/project-board/project-board.component';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { ProjectSummaryComponent } from './components/project-summary/project-summary.component';
import { ProjectSideBarComponent } from './components/project-side-bar/project-side-bar.component';
import { ProjectsComponent } from './projects.component';

const routes: Routes = [
  {
    path: '',
    canActivateChild:[AuthGuard],
    //canActivate:[AuthGuard],
    //component: ProjectsComponent,
    children: [
      { path: '', component: ProjectsComponent,},//diffrent ProjectS
      { path: ':projectname', component: ProjectSideBarComponent,//diffrent ProjecT
       children:[
        { path: 'summary', component: ProjectSummaryComponent,},
        { path: 'board', component: ProjectBoardComponent,},
        { path: 'list', component: ProjectListComponent,},
        { path: '**', redirectTo: 'summary', pathMatch: 'full' },
       ]
      },
      { path: '**', redirectTo: '', pathMatch: 'full' },
  ]
  },
];


// const routes: Routes = [
//   {
//     path: '',
//     canActivateChild:[AuthGuard],
//     //canActivate:[AuthGuard],
//     //component: ProjectsComponent,
//     children: [
//       { path: '',
//        component: ProjectsComponent,
//        children:[
//         //{path: 'login', component: LoginComponent},
//        ] 
//       },
//     ]
//   },
// ];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule { }

// const routes: Routes = [
//   {
//     path: '',
//     canActivateChild:[AuthGuard],
//     //canActivate:[AuthGuard],
//     //component: ProjectsComponent,
//     children: [
//       { path: '',
//        component: ProjectsComponent,
//        children:[
//         //{path: 'login', component: LoginComponent},
//        ] 
//       },
//     ]
//   },
// ];