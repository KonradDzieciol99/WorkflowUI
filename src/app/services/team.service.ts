import { HttpClient } from '@angular/common/http';
import { Injectable} from '@angular/core';
import { BehaviorSubject,concatMap,catchError,map,Observable,tap, throwError ,mergeMap} from 'rxjs';
import { Team } from '../models/Team.model';

@Injectable({
  providedIn: 'root'
})
export class TeamService{


  //private readonly CURRENT_TEAMID = 'CURRENT_TEAMID';
  private teamExample:Team={
    name: 'exampleName'
  }
  // CurrentTeam : BehaviorSubject<Team> = new BehaviorSubject<Team>(this.teamExample);
  private sourceCurrentTeam : BehaviorSubject<Team>=new BehaviorSubject<Team>(this.teamExample);
  currentTeam$ = this.sourceCurrentTeam.asObservable()
  private sourceExistingTeams : BehaviorSubject<Team[]>=new BehaviorSubject<Team[]>([]);
  existingTeams$ = this.sourceExistingTeams.asObservable()

  constructor(private http: HttpClient) { }

  // ngOnInit(): void {
  //   this.GetCurrentTeam();
  // }


  CreateTeam(Team:Team) {
    return this.http.post<Team>('api/Teams/CreateTeam',{Name:Team.name}).pipe(
      concatMap(() => { 
        return this.GetAll();
      })
    );
  }
  GetAll() {
    return this.http.get<Team[]>('api/Teams/GetAll').pipe(
      map((Teams: Team[]) => {
        console.log(Teams);
        if (Teams) {
         this.SetExistingTeams(Teams);
        }
      })
    );
  }
  DeleteTeam(team: Team) {
    return this.http.delete<Team[]>('api/Teams/DeleteTeam/'+team.id).pipe(
      concatMap(() => { 
        return this.GetAll();
      })
    )
  }
  // AddToTeams(data: Team) {

  //   let tempTeams:Team[];
  //   this.existingTeams$.subscribe(Teams=>{
  //     tempTeams=Teams;
  //     tempTeams.push()
  //   })
  //   this.existingTeams.next(data);
  // }
  SetExistingTeams(data: Team[]) {
    this.sourceExistingTeams.next(data);
  }
  SetCurrentTeam(data: Team) {
    this.sourceCurrentTeam.next(data);
  }
  
  // GetCurrentTeam() {
  //   return this.http.get<Team>('api/Teams/GetCurrent');
  // }
  // GetCurrentTeamNew() {
  //   return this.http.get<Team>('api/Teams/GetCurrent');
  // }

  // SetDefaultTeam(data: Team[]){
  //   // var teamId = localStorage.getItem(this.CURRENT_TEAMID);
  //   // if(teamId)
  //   // {
  //   //   var team =data.find(data=>{return data.id?.toString()===teamId})
  //   //   if (team) {
  //   //     this.SetDefaultTeamHelper(team);
  //   //   }      
  //   // }
  //   // else if (data[0]) {
  //   //   this.SetDefaultTeamHelper(data[0]);
  //   // } else {
  //   //  console.log("brak Teamów")
  //   // }
  // }
  // SetDefaultTeamHelper(data: Team): void {
  //   //localStorage.setItem(this.CURRENT_TEAMID, data.id?.toString()!);
  //   this.currentTeam.next(data);
  // }
}
