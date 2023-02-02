import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OAuthService } from 'angular-oauth2-oidc';
import { Subscription, take } from 'rxjs';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { HomeService } from 'src/app/home/home.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit, OnDestroy  {

  isCollapsed:boolean = true;
  public themeForm:FormGroup=this.formBuilder.nonNullable.group({
    radio:"auto"
  });
  themeFormValueChangesSub: Subscription | undefined;
  constructor(private readonly oAuthService: OAuthService,private homeService:HomeService,
      private authenticationService:AuthenticationService,
      private formBuilder: FormBuilder)
    {
      let theme = localStorage.getItem("theme");
      if (theme==="dark"||theme==="light") {
        this.themeForm.controls["radio"].setValue(theme);
      }
   }
   userPicture:string="https://w7.pngwing.com/pngs/419/473/png-transparent-computer-icons-user-profile-login-user-heroes-sphere-black-thumbnail.png"
  ngOnInit(): void {
    this.watchThemeButton();
    let idToken=this.oAuthService.getIdentityClaims();
    let picture=idToken['picture'] as string;
    let test=idToken['dsfsdfsadfasd'];
    if (picture){
      this.userPicture=picture;
    }
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
    // this.oAuthService.silentRefresh().then(()=>{
    //   console.log("fdg");
    // })
    // var sdf =this.oAuthService.getRefreshToken();
    // console.log(sdf);
     this.oAuthService.logOut()
    // this.oAuthService.revokeTokenAndLogout()
    //this.authenticationService.logout().pipe(take(1)).subscribe();
  }
  ngOnDestroy(): void {
    if (this.themeFormValueChangesSub) {
      this.themeFormValueChangesSub.unsubscribe();
    }
  }
}
