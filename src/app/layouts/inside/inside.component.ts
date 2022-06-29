import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { TeamService } from 'src/app/services/team.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inside',
  templateUrl: './inside.component.html',
  styleUrls: ['./inside.component.css']
})
export class InsideComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private router: Router,private breakpointObserver: BreakpointObserver,private teamService:TeamService,private authenticationService:AuthenticationService) {}

  LogOut(){
    this.authenticationService.logout();
    this.router.navigateByUrl('/')
  }

  ngOnInit(): void {
    this.teamService.GetAll().subscribe();
  }

}
