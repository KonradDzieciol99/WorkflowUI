import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class BusyService {

  busyRequestCount = 0;
  constructor(private ngxSpinnerService: NgxSpinnerService) { }

  async busy() {
    this.busyRequestCount++;
    await this.ngxSpinnerService.show();
  }

  async idle() {
    this.busyRequestCount--;
    if (this.busyRequestCount <= 0) {
      this.busyRequestCount = 0;
      await this.ngxSpinnerService.hide();
    }
  }
}
