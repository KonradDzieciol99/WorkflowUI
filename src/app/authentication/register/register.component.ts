import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, EMPTY, empty, Observable, of, take } from 'rxjs';
import { IRegisterUser } from 'src/app/shared/models/IRegisterUser';
import { CustomValidators } from 'src/app/shared/Validators/CustomValidators';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup = new FormGroup({
    email: new FormControl<string>('',[Validators.required, Validators.email,Validators.minLength(6)]),
    password: new FormControl<string>('',[Validators.required,Validators.minLength(6)]),
    repeatedPassword: new FormControl<string>('',[]),
  },{validators:CustomValidators.passwordMatch} );
  //CustomValidators.color("df")
  constructor(private authenticationService:AuthenticationService,
    private toastrService: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
  }
  onSubmit(form: FormGroup) {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched()
      return;
    }
    let registerUser:IRegisterUser={
      email: this.registerForm.get("email")?.value,
      password: this.registerForm.get("password")?.value
    }
    this.authenticationService.register(registerUser).pipe(take(1),
    ).subscribe({
      error:(err:HttpErrorResponse)=> {
        this.registerForm.setErrors({serverError: err.error?.Message})
    }}
    );
  }

}
