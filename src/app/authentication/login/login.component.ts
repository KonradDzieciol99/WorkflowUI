import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  //faLinkedin = faLinkedin
  loginForm: FormGroup = new FormGroup({
    email: new FormControl<string>('',[Validators.required, Validators.email,Validators.minLength(6)]),
    password: new FormControl<string>('',[Validators.required,Validators.minLength(6)]),
  });
  constructor(private authenticationService:AuthenticationService,
    private toastrService: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    let c= this.activatedRoute.snapshot;
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
    this.authenticationService.login(loginUser).pipe(take(1)).subscribe(() => {
        this.toastrService.success("Zalogowano");
        this.router.navigateByUrl('/home');
    });
  }

}
