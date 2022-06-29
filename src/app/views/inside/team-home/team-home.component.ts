import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Team } from 'src/app/models/Team.model';
import { TeamService } from 'src/app/services/team.service';


@Component({
  selector: 'app-team-home',
  templateUrl: './team-home.component.html',
  styleUrls: ['./team-home.component.css']
})
export class TeamHomeComponent implements OnInit {
  Team:Team;
// private activatedRouteSnapshot: ActivatedRouteSnapshot
  constructor(private router: Router,private activatedRoute: ActivatedRoute,private teamService: TeamService){
    this.activatedRoute.queryParams.subscribe(params => {
        console.log(params);
    })
      // console.log(this.router.getCurrentNavigation().extras.state['name']); // should log out 'bar'
      // const navigation = this.router.getCurrentNavigation();
      // const state = navigation.extras.state as {team: Team};
      // console.log(state.team);
   }

  ngOnInit(): void {
    //this.teamService.currentTeam$.subscribe(res=>this.Team=res);
  }

}
