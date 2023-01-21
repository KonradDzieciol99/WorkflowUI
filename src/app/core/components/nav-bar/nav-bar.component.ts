import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService, User } from '@auth0/auth0-angular';
import { Observable, Subscription, take } from 'rxjs';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { HomeService } from 'src/app/home/home.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit, OnDestroy  {

  user:Observable<User | null | undefined>
  isCollapsed:boolean = true;
  public themeForm:FormGroup=this.formBuilder.nonNullable.group({
    radio:"auto"
  });
  themeFormValueChangesSub: Subscription | undefined;
  constructor(private homeService:HomeService,
      private auth0Service:AuthService,
      private authenticationService:AuthenticationService,
      private formBuilder: FormBuilder)
    {
      let theme = localStorage.getItem("theme");
      if (theme==="dark"||theme==="light") {
        this.themeForm.controls["radio"].setValue(theme);
      }
      this.user=auth0Service.user$
   }
  ngOnInit(): void {
    this.watchThemeButton();
  }
  watchThemeButton() {
    this.themeFormValueChangesSub=this.themeForm.controls["radio"].valueChanges.subscribe(value=>{
   
      if (value==='light') {
        document.documentElement.setAttribute('data-bs-theme', 'light');
        localStorage.setItem("theme","light")
      }
      if (value==='dark') {
        document.documentElement.setAttribute('data-bs-theme', 'dark');
        localStorage.setItem("theme","dark")
      }
      if (value==='auto') {
        localStorage.setItem("theme","auto")
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          document.documentElement.setAttribute('data-bs-theme', 'dark');
        }
        else{
          document.documentElement.setAttribute('data-bs-theme', 'light');
        }
      }
    })
  }
  logout():void{
    this.auth0Service.logout()
    //this.authenticationService.logout().pipe(take(1)).subscribe();
  }
  ngOnDestroy(): void {
    if (this.themeFormValueChangesSub) {
      this.themeFormValueChangesSub.unsubscribe();
    }
  }
}
