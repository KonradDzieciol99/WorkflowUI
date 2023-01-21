import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, User } from '@auth0/auth0-angular';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { ILoginUser } from 'src/app/shared/models/ILoginUser';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({
    email: new FormControl<string>('',[Validators.required, Validators.email,Validators.minLength(6)]),
    password: new FormControl<string>('',[Validators.required,Validators.minLength(6)]),
  });
  constructor(private authenticationService:AuthenticationService,private auth0: AuthService,
    private toastrService: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    //this.auth0.user$.subscribe((x:User)=>x.)
    this.auth0.loginWithRedirect({appState: { target: '/home' }});
  }
  click(){
    this.authenticationService.test().pipe(take(1)).subscribe(x=>{
      console.log();
      console.log();
    });
  }
  onSubmit(form: FormGroup) {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched()
      return;
    }
    let loginUser:ILoginUser={
      email: this.loginForm.get("email")?.value,
      password: this.loginForm.get("password")?.value
    }
    this.authenticationService.login(loginUser).pipe(take(1)).subscribe({
      error:(err:HttpErrorResponse)=>{
        this.loginForm.setErrors({serverError: err.error?.Message})
      }}
    );
  }
}
