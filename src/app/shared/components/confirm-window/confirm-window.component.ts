import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-confirm-window',
  templateUrl: './confirm-window.component.html',
  styleUrls: ['./confirm-window.component.scss']
})
export class ConfirmWindowComponent {
  result: Subject<boolean>;
  constructor(public bsModalRef: BsModalRef) {
    this.result = new Subject<boolean>();
  }
  confirm(): void {
    this.result.next(true)
    this.bsModalRef?.hide();
  }
  decline(): void {
    this.result.next(false)
    this.bsModalRef?.hide();
  }
}
