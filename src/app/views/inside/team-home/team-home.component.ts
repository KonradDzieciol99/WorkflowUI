import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { Team } from 'src/app/models/Team.model';
import { TeamService } from 'src/app/services/team.service';
import {Breakpoints } from '@angular/cdk/layout';
import {shareReplay} from 'rxjs/operators';
import { SizeService } from 'src/app/services/size.service';
import { MatSidenav } from '@angular/material/sidenav';
import { debounceTime,distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-team-home',
  templateUrl: './team-home.component.html',
  styleUrls: ['./team-home.component.css']
})
export class TeamHomeComponent implements OnInit {
  @ViewChild('drawer')  drawer: MatSidenav;
  currentTeam:Team;
  private id:number;
// private activatedRouteSnapshot: ActivatedRouteSnapshot
  constructor(private sizeService:SizeService,private router: Router,private activatedRoute: ActivatedRoute,private teamService: TeamService,private breakpointObserver: BreakpointObserver){

    
    // this.activatedRoute.queryParams.subscribe(params => {
    //     console.log(params);
    // })
      // console.log(this.router.getCurrentNavigation().extras.state['name']); // should log out 'bar'
      // const navigation = this.router.getCurrentNavigation();
      // const state = navigation.extras.state as {team: Team};
      // console.log(state.team);
   }
   isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
   .pipe(
     map(result => result.matches),
     shareReplay()
   );
   //topSize$:Observable<number> = this.sizeService.currentToolbarSize$
   buttonState$:Observable<boolean> =this.sizeService.currentButtonStateSource$
  ngOnInit(): void {
    {
      this.activatedRoute.data.subscribe(value => {
        this.teamService.SetCurrentTeam(value['team'])
      });
    }
  }
  ngAfterViewInit() {
    this.sizeService.currentButtonStateSource$.pipe().subscribe((data:boolean)=>{this.drawer.toggle(data)})
  }

}
