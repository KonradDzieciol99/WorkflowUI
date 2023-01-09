import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, combineLatest, map, merge, mergeMap, Observable, skip, skipWhile, take, takeUntil, tap, throwError, timer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IRegisterUser } from '../shared/models/IRegisterUser';
import { IUser } from '../shared/models/IUser';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private baseUrl = environment.apiUrl;
  private currentUserSource = new BehaviorSubject<IUser|undefined>(undefined);
  currentUser$ = this.currentUserSource.asObservable();
  constructor(private http: HttpClient,
     private router: Router,
     private toastrService:ToastrService,
     private cookieService: CookieService) {
   }

  setAutoLogOutAndReminders(token:string){
   
    // this.currentUser$.pipe(skip(1),take(1)).subscribe(()=>{
    //     this.toastrService.clear(activeToast.toastId);
    // })

    let timeNowInMiliseconds= new Date().valueOf()
    let logoutTime:Date = new Date(timeNowInMiliseconds + (environment.AUTO_LOGOUT_TIME_IN_MINUTES * 60 * 1000));
    let reminderTime = new Date(logoutTime.valueOf() - (1 * 60 * 1000));

    let logoutTimer$ = timer(logoutTime).pipe(
      takeUntil(this.currentUserSource.pipe(skip(1))),
      map(()=>{
       this.toastrService.info("sesja się zakończyła")
       this.logout();
      })
    );
    let reminderTimer$ = timer(reminderTime).pipe(
      take(1),
      takeUntil(this.currentUserSource.pipe(skipWhile(user=>user!==undefined))),
      mergeMap(()=>{
        let activeToast = this.toastrService.info(`Z powodu braku aktywności sesja zakończy się w mniej niż minutę kliknij aby wydłużyć sesję`,undefined,{timeOut:0,extendedTimeOut:0});
        return activeToast.onTap.pipe(
          mergeMap(()=>{
            return this.refreshCurrentUser()
          }),
          tap(()=>{
            this.toastrService.info("Wydłużam sesję")
          })
          )
      })
    );

    merge(logoutTimer$,reminderTimer$).subscribe((value) => {
      console.log(value);
    })
    
  }
  refreshCurrentUser() {

    const cookies = this.cookieService.get("isLoginIn");

    if ((!cookies) || cookies!=="true") {
      return throwError(() => new Error("Empty cookie"));
    }

    return this.http.post<IUser>(this.baseUrl + 'account/refresh-token',{},{ withCredentials: true }).pipe(
      map((user?: IUser) => {
        if (user) {
          this.currentUserSource.next(user);
          this.setAutoLogOutAndReminders(user.token);
        }
      })
    )
  }
  login(values: any):Observable<void> {
    return this.http.post<IUser>(this.baseUrl + 'account/login', values,{withCredentials: true}).pipe(
      map((user: IUser) => {
        if (user) {
          this.currentUserSource.next(user);
          this.setAutoLogOutAndReminders(user.token);//userlogin event?
          this.cookieService.set("isLoginIn","true",100000,undefined,undefined,true,undefined);
        }
      })
    )
  }
  register(registerUser: IRegisterUser):Observable<void> {
    return this.http.post<IUser>(this.baseUrl + 'account/register', registerUser ,{withCredentials: true}).pipe(
      map((user: IUser) => {
        if (user) {
          this.currentUserSource.next(user);
        }
      })
    )
  }
  logout() {
    this.cookieService.delete(environment.COOKIE_REFRESH_TOKEN_NAME);//revoke request
    this.currentUserSource.next(undefined);
    this.router.navigateByUrl('/auth');
    this.toastrService.clear();
    this.toastrService.success("logged out successfully");
    this.cookieService.delete("isLoginIn");
  }
}

// merge(logoutTimer$,reminderTimer$).pipe(
//   takeUntil(this.currentUserSource.pipe(skip(1)))
// ).subscribe((value) => {
//   console.log(value);
// })

    // logoutTimer$.pipe(
    //   takeUntil(this.currentUserSource.pipe(skip(1)))
    // ).subscribe((value) => {
    //   console.log(value);
    // })
    
    // reminderTimer$.pipe(
    //   take(1),
    //   takeUntil(this.currentUserSource.pipe(skipWhile(user=>user!==undefined)))
    // ).subscribe((value) => {
    //   console.log(value);
    // })