import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Team } from 'src/app/models/Team.model';
import { TokenDbo } from 'src/app/models/TokenDbo.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { PTaskService } from 'src/app/services/ptask.service';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  
  currentTeam:Team;
  //currentUser!:TokenDbo;

  constructor(private activatedRoute: ActivatedRoute,
    public ptaskService:PTaskService ,public teamService: TeamService, private authenticationService: AuthenticationService) { 

  }
  temp:Team
  ngOnInit(): void {
    
    this.activatedRoute.parent.data.subscribe(value => {
      console.log('Some extra data:', value['team']);
      this.teamService.SetCurrentTeam(value['team'])
    });

      this.teamService.currentTeam$.subscribe(res=>{console.log(res);this.temp =res;});
      console.log(this.temp)

      console.log("test")

    // this.activatedRoute.data.subscribe(data => {
    //   this.currentTeam = data['team'];
    // })

    //this.activatedRoute.data
    //this.currentTeam=this.teamService.currentTeam$
    //this.teamService.currentTeam$.subscribe(T=>this.currentTeam=T);
    //this.ptaskService.GetAllByTeamId()
    //this.authenticationService.currentUser$.subscribe(T=>this.currentUser=T);
  }

}
