import { IfStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { GoogleAuthService } from './authentication/google-auth.service';
import { IdentityServerService } from './authentication/identity-server.service';
import { MicrosoftOpeinIDAuthService } from './authentication/microsoft-opein-id-auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'WorkflowUI';
  showHeader = false;
  showSidebar = false;
  showFooter = false;

  constructor(private readonly identityServerService: IdentityServerService, private router: Router,private activatedRoute: ActivatedRoute ) {

    
    //private readonly microsoftOpeinIDAuthService: MicrosoftOpeinIDAuthService,
    // private readonly googleAuthService: GoogleAuthService
    // googleAuthService.userProfileSubject.subscribe( info => {
    //   console.log(info)
    //   //this.userInfo = info
    // })
  }
  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showHeader = this.activatedRoute.firstChild?.snapshot.data['showHeader']!== false ? true : false;
        this.showSidebar = this.activatedRoute.firstChild?.snapshot.data['showSidebar']!== false ? true : false;
        this.showFooter = this.activatedRoute.firstChild?.snapshot.data['showFooter']!== false ? true : false;
      }
    });

    // if (window.matchMedia('(prefers-color-scheme: dark)')) {
    //   this.addEventListenerToPrefersColorScheme("dark");
    // }
    // else if (window.matchMedia('(prefers-color-scheme: light)')) {
    //   this.addEventListenerToPrefersColorScheme("light");
    // }
    // else{
    //   throw new Error("cannot match any color scheme");
    // }

   // this.setTheme();
    //this.addEventListenerToPrefersColorScheme();
  }
  // setTheme():void {
  //   // const theme = localStorage.getItem("theme");
  //   // if (theme==="dark"||theme==="light") {
  //   //   document.documentElement.setAttribute('data-bs-theme', theme); //bootsrap
  //   //   document.documentElement.className = theme; //syncfusion
  //   // } 
  //   // else if (theme==="auto"){
  //   //   document.documentElement.setAttribute('data-bs-theme', theme); //bootsrap
  //   //   document.documentElement.className = theme; //syncfusion


  //   // } 
  //   // else{
  //   //   const isPreferDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  //   // if (userTheme === 'dark' || userTheme === 'light') {
  //   //   theme = userTheme;
  //   // } else {
  //   //   theme = prefersDark ? 'dark' : 'light';
  //   // }
  //   // }

  // }
  // addEventListenerToPrefersColorScheme():void{ //Prefers color-scheme on Windows
  //   window.matchMedia(`(prefers-color-scheme: dark)`).addEventListener('change', event => {
  //     let theme = localStorage.getItem("theme")
  //     if (!(theme === "dark" || theme === "light")) {
  //       const newColorScheme = event.matches ? "dark" : "light";
  //       document.documentElement.setAttribute('data-bs-theme', newColorScheme);
  //       document.documentElement.className = newColorScheme;
  //     }
  // });
  // }

}
