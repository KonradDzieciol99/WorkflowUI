import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Team } from 'src/app/models/Team.model';
import { TeamService } from 'src/app/services/team.service';


@Component({
  selector: 'app-team-home',
  templateUrl: './team-home.component.html',
  styleUrls: ['./team-home.component.css']
})
export class TeamHomeComponent implements OnInit {
  Team:Team;

  constructor(private router: Router,private teamService: TeamService, private activatedRoute: ActivatedRoute){
    this.activatedRoute.queryParams.subscribe(params => {
      
      // params['id'] ? console.log("work") : console.log("not work");
    })
      // console.log(this.router.getCurrentNavigation().extras.state['name']); // should log out 'bar'
      // const navigation = this.router.getCurrentNavigation();
      // const state = navigation.extras.state as {team: Team};
      // console.log(state.team);
   }

  ngOnInit(): void {
    this.teamService.currentTeam$.subscribe(res=>this.Team=res);
  }

}
