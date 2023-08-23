import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { take, takeUntil } from 'rxjs';
import { ProjectsService } from 'src/app/projects/projects.service';
import { IIcon } from 'src/app/shared/models/IIcon';
import { IProjectCreateRequest } from 'src/app/shared/models/IProjectCreateRequest';
import { PhotosService } from 'src/app/shared/services/photos.service';
import { IconPickerComponent } from '../../icon-picker/icon-picker.component';

@Component({
  selector: 'app-create-project-modal',
  templateUrl: './create-project-modal.component.html',
  styleUrls: ['./create-project-modal.component.scss']
})
export class CreateProjectModalComponent implements OnInit {

  public projektForm:FormGroup;

  constructor(public bsModalRef: BsModalRef,private projectsService:ProjectsService,
    private toastrService:ToastrService,private photosService:PhotosService
    ,private modalService: BsModalService,private renderer: Renderer2){

     this.projektForm = new FormGroup({
        name: new FormControl<string>('',{ nonNullable: true,validators:[Validators.required,Validators.minLength(6)]}),
        icon: new FormControl<IIcon|null>(null, [Validators.required]),
      });

    }
  ngOnInit(): void {


    this.photosService.getProjectsIcons().pipe(take(1)).subscribe({
      next:(icons)=>{
        const random = Math.floor(Math.random() * icons.length);
        this.projektForm.get("icon")?.setValue(icons[random]);
      }
    });
  }
  openIconPicker(){
    const bsModalRef = this.modalService.show(IconPickerComponent, {class: 'modal-sm modal-dialog-centered'});
    
    if (bsModalRef.content) 
      bsModalRef.content.icons$ = this.photosService.icons$; 
    
    bsModalRef.content?.result$?.pipe(
      //take(1),
      takeUntil(this.modalService.onHide),
      takeUntil(this.modalService.onHidden)
      ).subscribe({
       next:(IIcon) => {
        this.projektForm.get("icon")?.setValue(IIcon);
       },
       complete:()=>{/*sub.unsubscribe();*/}
      })
  }
  createProject(){
    if (this.projektForm.invalid) {
      this.projektForm.markAllAsTouched()
      return;
    }

    this.projectsService.createProject(this.projektForm.value as IProjectCreateRequest)
    .pipe(take(1))
    .subscribe({
      next:(project)=>{
        this.toastrService.success(`Project ${project.name} has been created`);
        this.bsModalRef.hide();
      },
      error:(error:unknown)=>{
        if (error instanceof HttpErrorResponse) 
          this.projektForm.setErrors({serverError: error.error}); 
        else 
          console.error('Nieznany błąd:', error);
        },
      });
  }
  onImageLoad(event: Event ){
    this.renderer.addClass(event.target as HTMLImageElement, 'loaded');
  }
}
