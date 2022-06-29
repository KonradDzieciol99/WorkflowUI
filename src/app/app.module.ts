import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthComponent } from './layouts/auth/auth.component';
import { InsideComponent } from './layouts/inside/inside.component';
import { RegisterComponent } from './views/auth/register/register.component';
import { DashboardComponent } from './views/inside/dashboard/dashboard.component';
import { LoginComponent } from './views/auth/login/login.component';
import { InsideTopnavbarComponent } from './components/navbars/inside-topnavbar/inside-topnavbar.component';
import { JwtModule } from "@auth0/angular-jwt";

//do folderu material
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JWTInterceptor } from './interceptors/jwt.interceptor';
import { TeamsManagmentComponent } from './views/inside/teams-managment/teams-managment.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { TeamService } from './services/team.service';
import { CreateTeamComponent } from './components/dialogs/create-team/create-team.component';
import { ListComponent } from './views/inside/list/list.component';
import { TeamHomeComponent } from './views/inside/team-home/team-home.component';
//
@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    InsideComponent,
    RegisterComponent,
    DashboardComponent,
    LoginComponent,
    InsideTopnavbarComponent,
    TeamsManagmentComponent,
    CreateTeamComponent,
    ListComponent,
    TeamHomeComponent
  ],
  imports: [
 
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatTableModule,
    MatPaginatorModule ,
    MatInputModule,
    MatDialogModule ,
    JwtModule.forRoot({
      config: {
        tokenGetter: function  tokenGetter() { 
        return localStorage.getItem('token');
        } 
     }
   })
  ],
  providers: [FormBuilder,
    {provide: HTTP_INTERCEPTORS, useClass: JWTInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
