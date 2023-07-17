import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpTransportType, HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, combineLatest, concatMap, forkJoin, switchMap, take, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { INotification, NotificationType } from '../models/INotification';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {

  hubUrl = environment.signalRhubUrl;
  notificationUrl = environment.notificationUrl;
  private hubConnection?: HubConnection;
  onlineUsersSource: BehaviorSubject<string[]>;
  onlineUsers$:Observable<string[]>;
  private notificationsSource: BehaviorSubject<INotification[]>;
  notifications$:Observable<INotification[]>;
  private unreadNotificationsIdsSource: BehaviorSubject<string[]>;
  unreadNotificationsIds$:Observable<string[]>;
  private allNotificationsCountSource: BehaviorSubject<number>;
  allNotificationsCount$:Observable<number>;

  constructor(private toastr: ToastrService, private router: Router,private http: HttpClient) {
    this.onlineUsersSource = new BehaviorSubject<string[]>([]);
    this.onlineUsers$ = this.onlineUsersSource.asObservable();
    this.notificationsSource = new BehaviorSubject<INotification[]>([]);
    this.notifications$ = this.notificationsSource.asObservable();
    this.unreadNotificationsIdsSource = new BehaviorSubject<string[]>([]);
    this.unreadNotificationsIds$ = this.unreadNotificationsIdsSource.asObservable();
    this.allNotificationsCountSource = new BehaviorSubject<number>(0);
    this.allNotificationsCount$ = this.allNotificationsCountSource.asObservable();
   }
  getAllNotifications(){
    return this.http.get<INotification[]>(`${this.notificationUrl}/AppNotification`).pipe(
      take(1),
      tap(notifications=>this.notificationsSource.next(notifications))
    );
  }
  markNotificationAsRead(id:string){
    return this.http.put<void>(`${this.notificationUrl}/AppNotification/${id}`,{}).pipe(
      take(1),
      concatMap(() =>
        combineLatest([
          this.notifications$,
          this.unreadNotificationsIds$
        ]).pipe(take(1))
      ),
      tap(([notifications, unreadNotificationsIds]) => {
        const updatedNotifications = notifications.map((notification) =>
          notification.id === id ? { ...notification, displayed: true } : notification 
        );
  
        const updatedUnreadNotificationsIds = unreadNotificationsIds.filter(unreadNotificationId => 
          unreadNotificationId !== id
        );
  
        this.notificationsSource.next(updatedNotifications);
        this.unreadNotificationsIdsSource.next(updatedUnreadNotificationsIds);
      }),
    );
  }
  deleteNotification(notificationToDelete:INotification){
    return this.http.delete<void>(`${this.notificationUrl}/AppNotification/${notificationToDelete.id}`).pipe(
      take(1),
      tap(()=>{
        if (notificationToDelete.displayed == false) {
          this.unreadNotificationsIds$.pipe(take(1)).subscribe(unreadNotificationsIds =>  {
            let nextUnreadNotificationsIds = unreadNotificationsIds.filter(unreadNotification =>unreadNotification !== notificationToDelete.id);
            this.unreadNotificationsIdsSource.next(nextUnreadNotificationsIds);
          })
        }
        this.notifications$.pipe(take(1)).subscribe(notifications=>{
          let nextNotifications = notifications.filter(n => n.id !== notificationToDelete.id);
          this.notificationsSource.next(nextNotifications);
        })
        this.allNotificationsCount$.pipe(take(1)).subscribe(allNotificationsCount=>{
          let nextAllNotificationsCount = allNotificationsCount-1;
          this.allNotificationsCountSource.next(nextAllNotificationsCount);
        })
      })
    );
  }
  setADifferentTypeOfNotification(id:string ,notificationType:NotificationType):void{
    this.notifications$.pipe(take(1)).subscribe(notifications=>{
      const updatedNotifications = notifications.map((notification:INotification) =>
        notification.id === id ? { ...notification, notificationType: notificationType } : notification 
    );
      this.notificationsSource.next(updatedNotifications);
    })
  }
  createHubConnection(userAccessToken:string) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'Presence', {
        accessTokenFactory: () => userAccessToken,
        transport: HttpTransportType.WebSockets
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.on('UserIsOnline', email => {

      this.onlineUsers$.pipe(take(1)).subscribe({
        next: emails => {
        var index = emails.findIndex(e => e === email)
        if (index === -1)
          this.onlineUsersSource.next([...emails, email]);

        }
      })

    })
    this.hubConnection.on('UserIsOffline', email => {
      this.onlineUsers$.pipe(take(1)).subscribe({
        next: (emails:string[]) => this.onlineUsersSource.next(emails.filter(e => e !== email))
      })
    })
    this.hubConnection.on('NewMessageReceived', ({username, knownAs}) => {
      this.toastr.info(knownAs + ' has sent you a new message! Click me to see it')
        .onTap
        .pipe(take(1))
        .subscribe({
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
    
  //   concatMap(() =>
  //   combineLatest([
  //     this.notifications$,
  //     this.unreadNotificationsIds$
  //   ]).pipe(take(1))
  // ),

    this.hubConnection.on('NewNotificationReceived', (newNotification:INotification) => {

      combineLatest([
        this.notifications$,
        this.unreadNotificationsIds$,
        this.allNotificationsCount$
      ]).pipe(take(1))
      .subscribe(([notifications, unreadNotificationsIds,allNotificationsCount])=>{

        let newUnreadNotificationsIds:Array<string> = [...unreadNotificationsIds, newNotification.id];
        let newNotifications:Array<INotification> = [...notifications, newNotification];
        let oldNotificationIndex = notifications.findIndex(x => {

          let CurrentfriendRequestStageOne = 
            (x.notificationType === NotificationType.FriendRequestReceived ||
            x.notificationType === NotificationType.FriendRequestSent) 
            &&
            (newNotification.notificationType === NotificationType.FriendRequestAccepted ||
            newNotification.notificationType === NotificationType.InvitationDeclined);
        
          let removeExsitingInvitation = 
            x.notificationType === NotificationType.FriendRequestAccepted && 
            (newNotification.notificationType === NotificationType.InvitationDeclined ||
             newNotification.notificationType === NotificationType.InvitationDeclinedByYou);

          let NewCopy = x.notificationType === newNotification.notificationType;
        
          return x.notificationPartnerId === newNotification.notificationPartnerId && 
                (NewCopy || CurrentfriendRequestStageOne || removeExsitingInvitation);
        });
        
        if (oldNotificationIndex !== -1) {
          let oldNotification = notifications[oldNotificationIndex];
          if (oldNotification.displayed == false) {
            newUnreadNotificationsIds = unreadNotificationsIds.filter(x=>x !== oldNotification.id);
            allNotificationsCount-1;
          }
          newNotifications = newNotifications.filter(n => n !== oldNotification);
        }

        this.unreadNotificationsIdsSource.next(newUnreadNotificationsIds);
        this.notificationsSource.next(newNotifications);
        this.allNotificationsCountSource.next(allNotificationsCount + 1);
      })}
    );
    this.hubConnection.on('ReceiveNotifications',(PagedAppNotifications: {appNotifications: INotification[], totalCount: number}) => {
       //teraz trzba najpierw pobrac po http ??? po co ?
      // this.toastr.info(`${notification.content}`)
      //   .onTap
      //   .pipe(take(1))
      //   .subscribe({
      //     ///////////////!!!!!!!!!!!!!!!!!!!!!!
      //     //next: () => this.router.navigateByUrl('/members/' + username + '?tab=Messages')//!!!!!!!!!!!!!!!!!
      //   })
      //console.log(notifications);
      this.notificationsSource.next(PagedAppNotifications.appNotifications);
      this.allNotificationsCountSource.next(PagedAppNotifications.totalCount);
    });
    this.hubConnection.on('ReceiveOnlineUsers' , (emails:string[]) => {
      this.onlineUsersSource.next(emails);
    });
    this.hubConnection.on('ReceiveUnreadNotifications' , (unreadIds:string[]) => {
      this.unreadNotificationsIdsSource.next(unreadIds);
    });
    var hubConnectionState = this.hubConnection.start()
    .catch(error => console.log(error))
    .finally(/*() => this.busyService.idle()*/);

    return hubConnectionState;
  }
  stopHubConnection() {
    this.hubConnection?.stop().catch(error => console.log(error));
  }
}
