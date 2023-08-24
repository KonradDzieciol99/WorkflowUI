import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-confirm-window',
  templateUrl: './confirm-window.component.html',
  styleUrls: ['./confirm-window.component.scss'],
})
export class ConfirmWindowComponent {
  private resultSource$: Subject<boolean>;
  result$: Observable<boolean>;
  constructor(public bsModalRef: BsModalRef) {
    this.resultSource$ = new Subject();
    this.result$ = this.resultSource$.asObservable();
  }
  confirm(): void {
    this.resultSource$.next(true);
    this.bsModalRef.hide();
  }
  decline(): void {
    this.resultSource$.next(false);
    this.bsModalRef.hide();
  }
}
