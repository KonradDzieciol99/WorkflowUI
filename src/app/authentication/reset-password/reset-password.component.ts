import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent  implements OnInit {
  resetForm: FormGroup = new FormGroup({
    email: new FormControl<string>('',[Validators.required, Validators.email,Validators.minLength(6)]),
  });
  constructor(private authenticationService:AuthenticationService,
    private toastrService: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
  }
  click(){
    this.authenticationService.test().pipe(take(1)).subscribe(x=>{
      console.log();
      console.log();
    });
  }
  onSubmit(form: FormGroup) {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched()
      return;
    }
    let email = this.resetForm.get("email")?.value;
    this.authenticationService.resetPassword(email).pipe(take(1)).subscribe({
      error:(err:HttpErrorResponse)=>{
        this.resetForm.setErrors({serverError: err.error?.Message})
      }}
    );
  }

}
