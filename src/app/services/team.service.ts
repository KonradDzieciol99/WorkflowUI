import { HttpClient } from '@angular/common/http';
import { Injectable} from '@angular/core';
import { BehaviorSubject,concatMap,catchError,map,Observable,tap, throwError ,mergeMap} from 'rxjs';
import { Team } from '../models/Team.model';

@Injectable({
  providedIn: 'root'
})
export class TeamService{

  private teamExample:Team={
    name: 'exampleName'
  }
  // CurrentTeam : BehaviorSubject<Team> = new BehaviorSubject<Team>(this.teamExample);
  private sourceCurrentTeam : BehaviorSubject<Team>=new BehaviorSubject<Team>(this.teamExample);
  currentTeam$ = this.sourceCurrentTeam.asObservable()
  constructor(private http: HttpClient) { }


  CreateTeam(Team:Team) {
    return this.http.post<Team>('api/Teams/CreateTeam',{Name:Team.name});
  }
  GetAll() {
    return this.http.get<Team[]>('api/Teams/GetAll');
  }
  DeleteTeam(team: Team) {
    return this.http.delete<Team[]>('api/Teams/DeleteTeam/'+team.id);
  }
  SetCurrentTeam(data: Team) {
    this.sourceCurrentTeam.next(data);
  }

}
