import { NgModule } from '@angular/core';
import {
  EditService,
  ExcelExportService,
  FilterService,
  GroupService,
  PageService,
  SortService,
  ToolbarService,
} from '@syncfusion/ej2-angular-grids';
import { SharedModule } from '../shared/shared.module';
import { IconPickerComponent } from './components/icon-picker/icon-picker.component';
import { CreateProjectModalComponent } from './components/modals/create-project-modal/create-project-modal.component';
import { ProjectSideBarComponent } from './components/project-side-bar/project-side-bar.component';
import { SettingsDetailsComponent } from './components/settings-details/settings-details.component';
import { SettingsMembersComponent } from './components/settings-members/settings-members.component';
import { SettingsComponent } from './components/settings/settings.component';
import { FindLeaderPipe } from './pipes/find-leader.pipe';
import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectsComponent } from './projects.component';
import { EditMemberModalComponent } from './components/edit-member-modal/edit-member-modal.component';

@NgModule({
  declarations: [
    ProjectsComponent,
    ProjectSideBarComponent,
    CreateProjectModalComponent,
    IconPickerComponent,
    FindLeaderPipe,
    SettingsComponent,
    SettingsDetailsComponent,
    SettingsMembersComponent,
    EditMemberModalComponent,
  ],
  imports: [
    ProjectsRoutingModule,
    SharedModule,
  ],
  providers: [
    PageService,
    SortService,
    FilterService,
    GroupService,
    ToolbarService,
    ExcelExportService,
    EditService,
  ],
})
export class ProjectsModule {}
