import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  returnUrl!: string;

  constructor(
      private formBuilder: FormBuilder,
     // private route: ActivatedRoute,
      private router: Router,
      private authenticationService: AuthenticationService,
      //private alertService: AlertService
  ) {
      // redirect to home if already logged in
      //if (this.authenticationService.currentUserValue) { 
      //    this.router.navigate(['/']);
      //}
      this.loginForm = this.formBuilder.group({
        email: ['', [Validators.required,Validators.email]],
        password: ['', [Validators.required,Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    this.loginForm.value.password
      // get return url from route parameters or default to '/'
      //this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
      //this.loginForm.
    }

  // convenience getter for easy access to form fields
  //get f() { return this.loginForm.controls; }

  onSubmit(): void {
      const val = this.loginForm.value;
      this.submitted = true;

      // // stop here if form is invalid
      if (this.loginForm.invalid) {
           return;
       }

        this.loading = true;

        this.authenticationService.Login(val.email, val.password)
        .subscribe(
            (response) => { 
                this.router.navigateByUrl('/inside');
            },
            responseEror => {
                this.loginForm.setErrors({serverError: responseEror.error.Message+" "+responseEror.status}),
                console.log(responseEror.status)
                });
    }

}
