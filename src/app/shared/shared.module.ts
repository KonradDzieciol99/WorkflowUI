import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { InputCustomComponent } from './components/input-custom/input-custom.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ConfirmWindowComponent } from './components/confirm-window/confirm-window.component';
import { ReactiveInputComponent } from './components/reactive-input/reactive-input.component';
import { ReactiveDatePickerComponent } from './components/reactive-date-picker/reactive-date-picker.component';
import { NgbCollapseModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveDropdownComponent } from './components/reactive-dropdown/reactive-dropdown.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { CReactiveDropdownComponent } from './components/c-reactive-dropdown/c-reactive-dropdown.component';
import { MapGetValuePipe } from './pipes/map-get-value.pipe';
import { AddMemberIconComponent } from './components/add-member-icon/add-member-icon.component';
import { AddProjectMemberModalComponent } from './components/modals/add-project-member-modal/add-project-member-modal.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ImgErrorDirective } from './directives/img-error.directive';
import { BreadcrumbModule } from 'xng-breadcrumb';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { GridModule } from '@syncfusion/ej2-angular-grids';

@NgModule({
  declarations: [
    ConfirmWindowComponent,
    ReactiveInputComponent,
    ReactiveDatePickerComponent,
    ReactiveDropdownComponent,
    CReactiveDropdownComponent,
    MapGetValuePipe,
    AddMemberIconComponent,
    AddProjectMemberModalComponent,
    ImgErrorDirective,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TooltipModule.forRoot(),
    CollapseModule.forRoot(),
    ModalModule.forRoot(),
    NgbDatepickerModule,
    BsDropdownModule.forRoot(),
    ButtonsModule.forRoot(),
    TabsModule.forRoot(),
    BreadcrumbModule,
    ReactiveFormsModule,
    NgbCollapseModule,
    InfiniteScrollModule,
    GridModule,

  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    ReactiveInputComponent,
    ReactiveDatePickerComponent,
    ReactiveDropdownComponent,
    CReactiveDropdownComponent,
    MapGetValuePipe,
    AddMemberIconComponent,
    TabsModule,
    TooltipModule,
    ImgErrorDirective,
    BreadcrumbModule,
    ButtonsModule,
    InfiniteScrollModule,
    NgbCollapseModule,
    BsDropdownModule,
    NgbDatepickerModule,
    ModalModule,
    CollapseModule,
    GridModule
  ],
})
export class SharedModule {}
