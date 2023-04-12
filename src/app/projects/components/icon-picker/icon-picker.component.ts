import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Observable, Subject, take } from 'rxjs';
import { IIcon } from 'src/app/shared/models/IIcon';
import { PhotosService } from 'src/app/shared/services/photos.service';

@Component({
  selector: 'app-icon-picker',
  templateUrl: './icon-picker.component.html',
  styleUrls: ['./icon-picker.component.scss']
})
export class IconPickerComponent implements OnInit {

  
  result: Subject<IIcon> = new Subject<IIcon>();
  icons:Observable<Array<IIcon>> | undefined
  selectedIcon:IIcon|undefined;
  constructor(private photosService:PhotosService,public bsModalRef: BsModalRef) {
  }
  ngOnInit(): void {
    // this.photosService.getProjectsIcons().pipe(take(1)).subscribe({
    //   next:(icons)=>{this.icons=icons}
    // });
  }
  select(){
    if (this.selectedIcon) {
      this.result.next(this.selectedIcon);
      this.bsModalRef.hide();
    }
     
  }

}
