import { Component } from '@angular/core';
import { AddProjectMemberModalComponent } from '../modals/add-project-member-modal/add-project-member-modal.component';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-add-member-icon',
  templateUrl: './add-member-icon.component.html',
  styleUrls: ['./add-member-icon.component.scss']
})
export class AddMemberIconComponent {

  constructor(private modalService: BsModalService) {
  
  }
  open(){
    //let bsModalRef = 
    this.modalService.show(AddProjectMemberModalComponent, {class: 'modal-sm modal-dialog-centered'});

  }
}
