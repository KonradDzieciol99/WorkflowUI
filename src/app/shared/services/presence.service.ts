import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpTransportType,
  HubConnection,
  HubConnectionBuilder,
} from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  concatMap,
  forkJoin,
  map,
  mergeMap,
  of,
  take,
  tap,
} from 'rxjs';
import { environment } from 'src/environments/environment';
import { INotification, NotificationType } from '../models/INotification';

@Injectable({
  providedIn: 'root',
})
export class PresenceService {
  //hubUrl = environment.signalRhubUrl;
  //notificationUrl = environment.notificationUrl;
  private hubConnection?: HubConnection;
  private onlineUsersSource$: BehaviorSubject<string[]>;
  onlineUsers$: Observable<string[]>;
  private notificationsSource$: BehaviorSubject<INotification[]>;
  notifications$: Observable<INotification[]>;
  private unreadNotificationsIdsSource$: BehaviorSubject<string[]>;
  unreadNotificationsIds$: Observable<string[]>;
  private allNotificationsCountSource$: BehaviorSubject<number>;
  allNotificationsCount$: Observable<number>;
  baseUrl: string;
  constructor(
    private toastr: ToastrService,
    private router: Router,
    private http: HttpClient,
  ) {
    this.baseUrl = environment.WorkflowUrl;
    this.onlineUsersSource$ = new BehaviorSubject<string[]>([]);
    this.onlineUsers$ = this.onlineUsersSource$.asObservable();
    this.notificationsSource$ = new BehaviorSubject<INotification[]>([]);
    this.notifications$ = this.notificationsSource$.asObservable();
    this.unreadNotificationsIdsSource$ = new BehaviorSubject<string[]>([]);
    this.unreadNotificationsIds$ =
      this.unreadNotificationsIdsSource$.asObservable();
    this.allNotificationsCountSource$ = new BehaviorSubject(0);
    this.allNotificationsCount$ =
      this.allNotificationsCountSource$.asObservable();
  }
  getAllNotifications(takeAmount:number=20) {
    return this.notifications$.pipe(
      mergeMap(currentNotifications=>{
        let params = new HttpParams();
        params = params.append('Skip', currentNotifications.length.toString());
        params = params.append('Take', takeAmount.toString());
        return this.http
        .get<INotification[]>(`${this.baseUrl}/notification/api/AppNotification`,{params:params})
        .pipe(
          take(1),
          tap((notifications) => this.notificationsSource$.next([...currentNotifications,...notifications])),
        );
      })
    )
  }
  onlineUsersNext(next: string[]) {
    this.onlineUsersSource$.next(next);
  }
  markNotificationAsRead(id: string) {
    return this.http
      .put<void>(`${this.baseUrl}/notification/api/AppNotification/${id}`, {})
      .pipe(
        take(1),
        concatMap(() =>
          combineLatest([
            this.notifications$,
            this.unreadNotificationsIds$,
          ]).pipe(take(1)),
        ),
        tap(([notifications, unreadNotificationsIds]) => {
          const updatedNotifications = notifications.map((notification) =>
            notification.id === id
              ? { ...notification, displayed: true }
              : notification,
          );

          const updatedUnreadNotificationsIds = unreadNotificationsIds.filter(
            (unreadNotificationId) => unreadNotificationId !== id,
          );

          this.notificationsSource$.next(updatedNotifications);
          this.unreadNotificationsIdsSource$.next(
            updatedUnreadNotificationsIds,
          );
        }),
      );
  }
  deleteNotification(notificationToDelete: INotification) {
    return this.http
      .delete<void>(
        `${this.baseUrl}/notification/api/AppNotification/${notificationToDelete.id}`
      )
      .pipe(
        take(1),
        mergeMap(() => {
          const updates:(Observable<string[]> | Observable<INotification[]>|Observable<number>)[] = [];
          
          if (!notificationToDelete.displayed) {
            const updateUnreadNotifications$ = this.unreadNotificationsIds$
              .pipe(
                take(1),
                map(unreadNotificationsIds => 
                  unreadNotificationsIds.filter(
                    unreadNotification => unreadNotification !== notificationToDelete.id
                  )
                ),
                tap(nextUnreadNotificationsIds => {
                  this.unreadNotificationsIdsSource$.next(nextUnreadNotificationsIds);
                })
              );

            updates.push(updateUnreadNotifications$);
          }

          const updateNotifications$ = this.notifications$
            .pipe(
              take(1),
              map(notifications => 
                notifications.filter(n => n.id !== notificationToDelete.id)
              ),
              tap(nextNotifications => {
                this.notificationsSource$.next(nextNotifications);
              })
            );

          updates.push(updateNotifications$);

          const updateAllNotificationsCount$ = this.allNotificationsCount$
            .pipe(
              take(1),
              map(allNotificationsCount => allNotificationsCount - 1),
              tap(nextAllNotificationsCount => {
                this.allNotificationsCountSource$.next(nextAllNotificationsCount);
              })
            );

          updates.push(updateAllNotificationsCount$);

          return forkJoin(updates);
        })
      );
}
  setADifferentTypeOfNotification(
    id: string,
    notificationType: NotificationType,
    setDisplay = false,
  ) {
    return combineLatest([
      this.notifications$,
      this.unreadNotificationsIds$,
    ]).pipe(
      take(1),
      tap(([notifications, unreadNotificationsIds]) => {
        const updatedNotifications = notifications.map(
          (notification: INotification) => {
            if (setDisplay)
              return notification.id === id
                ? {
                    ...notification,
                    notificationType: notificationType,
                    displayed: true,
                  }
                : notification;
            else
              return notification.id === id
                ? { ...notification, notificationType: notificationType }
                : notification;
          },
        );
        this.notificationsSource$.next(updatedNotifications);

        if (setDisplay) {
          const newUnreadNotificationsIds = unreadNotificationsIds.filter(
            (x) => x !== id,
          );
          this.unreadNotificationsIdsSource$.next(newUnreadNotificationsIds);
        }
      }),
    );
  }
  //environment
  //`${this.baseUrl}/hub/Presence`
  //`${environment.signalRhubUrlhttp}Presence`
  createHubConnection(userAccessToken: string) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${this.baseUrl}/hub/Presence`, {
        accessTokenFactory: () => userAccessToken,
        transport: HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.on('UserIsOnline', (email: string) => {
      this.onlineUsers$.pipe(take(1)).subscribe({
        next: (emails) => {
          const index = emails.findIndex((e) => e === email);
          if (index === -1) this.onlineUsersSource$.next([...emails, email]);
        },
      });
    });
    this.hubConnection.on('UserIsOffline', (email: string) => {
      this.onlineUsers$.pipe(take(1)).subscribe({
        next: (emails: string[]) =>
          this.onlineUsersSource$.next(emails.filter((e) => e !== email)),
      });
    });
    this.hubConnection.on('NewMessageReceived', (email: string) => {
      this.toastr
        .info(`${email} has sent you a new message! Click me to see it`)
        .onTap.pipe(take(1))
        .subscribe({
          next: async () => {
            await this.router.navigateByUrl(`/members/${email}?tab=Messages`);
          },
        });
    });

    this.hubConnection.on(
      'NewInvitationToFriendsReceived',
      (inviterEmail: string) => {
        this.toastr
          .info(`${inviterEmail} sent you a friend request.`)
          .onTap.pipe(take(1))
          .subscribe();
      },
    );

    this.hubConnection.on(
      'NewNotificationReceived',
      (newNotification: INotification) => {
        combineLatest([
          this.notifications$,
          this.unreadNotificationsIds$,
          this.allNotificationsCount$,
        ])
          .pipe(take(1))
          .subscribe(
            ([
              notifications,
              unreadNotificationsIds,
              allNotificationsCount,
            ]) => {
              let newUnreadNotificationsIds = [
                ...unreadNotificationsIds,
                newNotification.id,
              ];
              let newNotifications = [...notifications, newNotification];

              if (newNotification.oldNotificationsIds) {
                for (const oldNotificationsId of newNotification.oldNotificationsIds) {
                  const oldNotificationIndex = notifications.findIndex(
                    (x) => x.id === oldNotificationsId,
                  );

                  if (oldNotificationIndex !== -1) {
                    const oldNotification = notifications[oldNotificationIndex];
                    if (!oldNotification.displayed) {
                      newUnreadNotificationsIds = unreadNotificationsIds.filter(
                        (x) => x !== oldNotification.id,
                      );
                      allNotificationsCount = allNotificationsCount - 1;
                    }
                    newNotifications = newNotifications.filter(
                      (n) => n !== oldNotification,
                    );
                  }
                }
              }
              this.unreadNotificationsIdsSource$.next(
                newUnreadNotificationsIds,
              );
              this.notificationsSource$.next(newNotifications);
              this.allNotificationsCountSource$.next(allNotificationsCount + 1);
            },
          );
      },
    );

    this.hubConnection.on(
      'ReceiveNotifications',
      (PagedAppNotifications: {
        appNotifications: INotification[];
        totalCount: number;
      }) => {
        this.notificationsSource$.next(PagedAppNotifications.appNotifications);
        this.allNotificationsCountSource$.next(
          PagedAppNotifications.totalCount,
        );
      },
    );
    this.hubConnection.on('ReceiveOnlineUsers', (emails: string[]) => {
      this.onlineUsersSource$.next(emails);
    });
    this.hubConnection.on(
      'ReceiveUnreadNotifications',
      (unreadIds: string[]) => {
        this.unreadNotificationsIdsSource$.next(unreadIds);
      },
    );
    const hubConnectionState = this.hubConnection
      .start()
      .catch((error) => console.log(error))
      .finally();

    return hubConnectionState;
  }
  stopHubConnection() {
    this.hubConnection?.stop().catch((error) => console.log(error));
  }
}
