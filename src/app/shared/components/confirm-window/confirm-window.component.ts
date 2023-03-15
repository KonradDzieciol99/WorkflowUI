import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-confirm-window',
  templateUrl: './confirm-window.component.html',
  styleUrls: ['./confirm-window.component.scss']
})
export class ConfirmWindowComponent  implements OnInit  {
  // title?: string;
  // closeBtnName?: string;
  // list: any[] = [];
  result: Subject<boolean> = new Subject<boolean>();

 
  constructor(public bsModalRef: BsModalRef) {}
 
  ngOnInit() {
    //his.list.push('PROFIT!!!');
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
