import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenDbo } from '../models/TokenDbo.model';
import { ReplaySubject, shareReplay } from 'rxjs';
import { catchError, map, retry, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private currentUserSource = new ReplaySubject<TokenDbo>(1);
  currentUser$ = this.currentUserSource.asObservable();

  //private readonly JWT_TOKEN = 'JWT_TOKEN';
  //private readonly EXPIRE_AT = 'EXPIRE_AT';
  //private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';


  constructor(private http: HttpClient) {

  }
  
  Register(email: string, password: string) {
    return this.http.post<TokenDbo>('api/Account/Register', { email, password }).pipe(
      map((user: TokenDbo) => {
        if (user) {
         this.SetSession(user);
         //this.presence.createHubConnection(user);
        }
      })
    )
  }
  Login(email: string, password: string) {
    return this.http.post<TokenDbo>('api/Account/Login', { email, password }, { withCredentials: true }).pipe(
      map((response: TokenDbo) => {
        const user = response;
        if (user) {
          this.SetSession(user);
          //this.presence.createHubConnection(user);
        }
      })
    )
  }
  logout() {
    //localStorage.removeItem(this.JWT_TOKEN);
    //localStorage.removeItem(this.EXPIRE_AT);
    //localStorage.removeItem(this.REFRESH_TOKEN);

    localStorage.removeItem("JWT_TOKEN");
    this.currentUserSource.next(null);
    //this.presence.stopHubConnection();
    console.log("usunieto tokeny");
  }


  // getJwtToken() {
  //   return localStorage.getItem(this.JWT_TOKEN);
  // }

  SetSession(authResult: TokenDbo) {

    // localStorage.setItem(this.JWT_TOKEN, authResult.token);
    // localStorage.setItem(this.EXPIRE_AT, authResult.expireMinutes.toString());

    localStorage.setItem("JWT_TOKEN", JSON.stringify(authResult));
    this.currentUserSource.next(authResult);
    console.log("dodano tokeny");
  }
}






// Register(email: string, password: string) {
//   return this.http.post<TokenDbo>('api/Account/Register', { email, password }).pipe(
//     tap((data) => this.SetSession(data)),shareReplay()
//   )
// }
// Login(email: string, password: string) {
//   return this.http.post<TokenDbo>('api/Account/Login', { email, password }, { withCredentials: true }).pipe(
//     tap((data) => this.SetSession(data)),shareReplay()
//     //catchError((error) =>{ return error })),
//   )