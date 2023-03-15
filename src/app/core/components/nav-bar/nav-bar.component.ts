import { Component, ElementRef, HostListener, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OAuthService } from 'angular-oauth2-oidc';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { filter, map, Observable, Subscription, take } from 'rxjs';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { HomeService } from 'src/app/home/home.service';
import { INotification } from 'src/app/shared/models/INotification';
import { PresenceService } from 'src/app/shared/services/presence.service';

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
  isNotificationsPanelExpanded:boolean=false;
  // notifications$: Observable<INotification[]>;
  // @ViewChild('notificationsPanel') notificationsPanel: ElementRef<HTMLDivElement> | undefined;

  // modalRef?: BsModalRef;
  // config = {
  //   backdrop: false,
  //   ignoreBackdropClick: false
  // };
  // notifications$: Observable<INotification[]>;
  // test:string;
  notificationsLength$: Observable<number>;
  constructor(private readonly oAuthService: OAuthService,private homeService:HomeService,
      private authenticationService:AuthenticationService,
      private formBuilder: FormBuilder,
      private presenceService : PresenceService,
      // private modalService: BsModalService
      )
    {
      let theme = localStorage.getItem("theme");
      if (theme==="dark"||theme==="light") {
        this.themeForm.controls["radio"].setValue(theme);
      }
      // this.notifications$=this.presenceService.notifications$;//destroy
      this.notificationsLength$=this.presenceService.notifications$.pipe(
        map(x=>{ return x.filter(n=>n.displayed==false).length})
      );
      // this.notifications$.subscribe
      // this.test="d";
   }
   userPicture:string="https://w7.pngwing.com/pngs/419/473/png-transparent-computer-icons-user-profile-login-user-heroes-sphere-black-thumbnail.png"
  
   test33(e:any){
    console.log("sdfsadfsadfssssssssssssssss")
   }
   ngOnInit(): void {
    this.watchThemeButton();
    let idToken=this.oAuthService.getIdentityClaims();
    let picture=idToken['picture'] as string;
    let test=idToken['dsfsdfsadfasd'];
    if (picture){
      this.userPicture=picture;
    }

    
  }
  // openModal(template: TemplateRef<any>) {
  //   this.modalRef = this.modalService.show(template, this.config);
  // }
 
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

  // @HostListener('document:click', ['$event.target']) //to musi być w komponencie od notificationsPanel
  // onClick(targetElement: HTMLElement) {
  //   if (this.notificationsPanel) {
  //     const clickedInside = this.notificationsPanel.nativeElement.contains(targetElement);
  //     if (!clickedInside) {
  //       // kod do wykonania, gdy użytkownik kliknie poza divem
  //       this.isNotificationsPanelExpanded=false;
  //       console.log("inside");
  //     }  
  //     console.log("outside");
  //   }
  // }
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
