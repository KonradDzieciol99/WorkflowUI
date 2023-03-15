import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpTransportType, HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, take, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { INotification } from '../models/INotification';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {

  hubUrl = environment.signalRhubUrl;
  notificationUrl = environment.notificationUrl;
  notificationServiceUrl = environment.notificationServiceUrl;
  private hubConnection?: HubConnection;
  private onlineUsersSource = new BehaviorSubject<string[]>([]);
  onlineUsers$ = this.onlineUsersSource.asObservable();
  private notificationsSource = new BehaviorSubject<INotification[]>([]);
  notifications$ = this.notificationsSource.asObservable();

  constructor(private toastr: ToastrService, private router: Router,private http: HttpClient) { }

  getAllNotifications(){
    return this.http.get<INotification[]>(`${this.notificationUrl}AppNotification`).pipe(
      take(1),
      tap(notifications=>this.notificationsSource.next(notifications))
    );
  }
  markNotificationAsRead(id:string){
    return this.http.put<void>(`${this.notificationServiceUrl}/AppNotification/${id}`,{}).pipe(
      take(1),
      tap(()=>{
        this.notifications$.pipe(take(1)).subscribe(notifications=>{
          let nextNotifications = notifications.map((notification) =>
            notification.id === id ? { ...notification, displayed: true } : notification 
          );
          this.notificationsSource.next(nextNotifications);
        })

      })
    );
  }
  deleteNotification(id:string){
    return this.http.delete<void>(`${this.notificationServiceUrl}/AppNotification/${id}`).pipe(
      take(1),
      tap(()=>{
        this.notifications$.pipe(take(1)).subscribe(notifications=>{
          let nextNotifications = notifications.filter(notification => notification.id !== id);
          this.notificationsSource.next(nextNotifications);
        })

      })
    );
  }
  createHubConnection(userAccessToken:string) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'Presence', {
        accessTokenFactory: () => userAccessToken,
        transport: HttpTransportType.WebSockets
      })
      .withAutomaticReconnect()
      .build();

    //this.hubConnection.start().catch(error => console.log(error));

    this.hubConnection.on('UserIsOnline', username => {
      this.onlineUsers$.pipe(take(1)).subscribe({
        next: usernames => this.onlineUsersSource.next([...usernames, username])
      })
    })

    this.hubConnection.on('UserIsOffline', username => {
      this.onlineUsers$.pipe(take(1)).subscribe({
        next: usernames => this.onlineUsersSource.next(usernames.filter(x => x !== username))
      })
    })

    this.hubConnection.on('GetOnlineUsers', usernames => {
      this.onlineUsersSource.next(usernames);
    })

    this.hubConnection.on('NewMessageReceived', ({username, knownAs}) => {
      this.toastr.info(knownAs + ' has sent you a new message! Click me to see it')
        .onTap
        .pipe(take(1))
        .subscribe({
          ///////////////!!!!!!!!!!!!!!!!!!!!!!
          next: () => this.router.navigateByUrl('/members/' + username + '?tab=Messages')//!!!!!!!!!!!!!!!!!
        })
    });

    this.hubConnection.on('NewInvitationToFriendsReceived', ({inviterEmail}) => {
      this.toastr.info(`${inviterEmail} sent you a friend request.`)
        .onTap
        .pipe(take(1))
        .subscribe({
          ///////////////!!!!!!!!!!!!!!!!!!!!!!
          //next: () => this.router.navigateByUrl('/members/' + username + '?tab=Messages')//!!!!!!!!!!!!!!!!!
        })
    });
    // this.hubConnection.on('NewChatNotificationReceived', (notification:INotification) => {
    //   this.onlineUsersSource.next(usernames);
    // })
    this.hubConnection.on('NewNotificationReceived', (notification:INotification) => {
      this.notifications$.pipe(take(1)).subscribe(notifications=>{
        this.notificationsSource.next([...notifications,notification]);
      })
    });
    // this.hubConnection.on('NotificationThread', (notifications:INotification[]) => { //teraz trzba najpierw pobrac po http
    //   // this.toastr.info(`${notification.content}`)
    //   //   .onTap
    //   //   .pipe(take(1))
    //   //   .subscribe({
    //   //     ///////////////!!!!!!!!!!!!!!!!!!!!!!
    //   //     //next: () => this.router.navigateByUrl('/members/' + username + '?tab=Messages')//!!!!!!!!!!!!!!!!!
    //   //   })
    //   console.log(notifications);
    //   this.notificationsSource.next(notifications);
    // });
    var hubConnectionState = this.hubConnection.start()
    .catch(error => console.log(error))
    .finally(/*() => this.busyService.idle()*/);

    return hubConnectionState;
  }

  stopHubConnection() {
    this.hubConnection?.stop().catch(error => console.log(error));
  }
}
