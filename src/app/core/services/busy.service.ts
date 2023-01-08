import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class BusyService {

  busyRequestCount = 0;
  constructor(private ngxSpinnerService: NgxSpinnerService) { }

  busy() {
    this.busyRequestCount++;
    this.ngxSpinnerService.show();
  }

  idle() {
    this.busyRequestCount--;
    if (this.busyRequestCount <= 0) {
      this.busyRequestCount = 0;
      this.ngxSpinnerService.hide();
    }
  }
}
