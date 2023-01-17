import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { AuthenticationResult } from '@azure/msal-browser';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { ILoginUser } from 'src/app/shared/models/ILoginUser';
import { IUser } from 'src/app/shared/models/IUser';
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
  constructor(private msalService: MsalService,private authenticationService:AuthenticationService,
    private toastrService: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    // this.msalService.instance.handleRedirectPromise().then( res => {
    //   //this.authenticationService.te
    //   if (res != null && res.account != null) {
    //     this.msalService.instance.setActiveAccount(res.account)
    //     let user:IUser={
    //       email: res.account?.username!,
    //       token: res.accessToken
    //     };
    //     //this.authenticationService.testnext(user);
    //     console.log(res);
    //   }
    // })
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
  microsoftlogin(){
    this.msalService.loginRedirect();
    // this.msalService.loginPopup()
    //   .subscribe((response: AuthenticationResult) => {
    //     this.msalService.instance.setActiveAccount(response.account);
    //     let user:IUser={
    //       email: response.account?.username!,
    //       token: response.accessToken
    //     };
    //     this.authenticationService.testnext(user);
    //     console.log(response);
    //   });
  }
  isLoggedIn(): boolean {
    return this.msalService.instance.getActiveAccount() != null
  }
}
