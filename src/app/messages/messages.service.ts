import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  HttpTransportType,
  HubConnection,
  HubConnectionBuilder,
} from '@microsoft/signalr';
import { OAuthService } from 'angular-oauth2-oidc';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  concatMap,
  map,
  mergeMap,
  take,
  tap,
} from 'rxjs';
import { environment } from 'src/environments/environment';
import { IFriendInvitation } from '../shared/models/IFriendInvitation';
import { ISearchedUser, UserFriendStatusType } from '../shared/models/ISearchedUser';
import { IUser } from '../shared/models/IUser';
import { PresenceService } from '../shared/services/presence.service';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  private confirmedInvitationsSource$: BehaviorSubject<IFriendInvitation[]>;
  confirmedInvitations$: Observable<IFriendInvitation[]>;
  private receivedFriendRequestsSource$: BehaviorSubject<IFriendInvitation[]>;
  receivedFriendRequests$: Observable<IFriendInvitation[]>;
  friendsWithActivityStatus$: Observable<IUser[]>;
  private hubConnection?: HubConnection;
  baseUrl: string;
  searchNewUsersSource$: BehaviorSubject<ISearchedUser[]>;
  searchNewUsers$: Observable<ISearchedUser[]>;
  constructor(
    private http: HttpClient,
    private readonly presenceService: PresenceService,
    private readonly oAuthService: OAuthService,
  ) {
    this.baseUrl = `${environment.WorkflowUrl}/chat`;

    this.searchNewUsersSource$ = new BehaviorSubject([] as ISearchedUser[]);
    this.searchNewUsers$ = this.searchNewUsersSource$.asObservable();
    
    this.confirmedInvitationsSource$ = new BehaviorSubject<IFriendInvitation[]>(
      [],
    );
    this.confirmedInvitations$ =
      this.confirmedInvitationsSource$.asObservable();
    this.receivedFriendRequestsSource$ = new BehaviorSubject<
      IFriendInvitation[]
    >([]);
    this.receivedFriendRequests$ =
      this.receivedFriendRequestsSource$.asObservable();
    const userClaims = this.oAuthService.getIdentityClaims();
    const user: IUser = {
      email: userClaims['email'] as string,
      id: userClaims['sub'] as string,
      photoUrl: userClaims['picture'] as string | undefined,
    };
    this.friendsWithActivityStatus$ = this.getFriendsWithActivityStatus(user);
  }
  findUsersByEmailAndCheckState(
    searchTerm : string,
    isScroll : boolean,
    takeAmount = 10,
    ) {
    return this.searchNewUsers$.pipe(
      mergeMap(currentSearchNewUsers=>{
        let params = new HttpParams();

        params = params.append('Skip',isScroll ? currentSearchNewUsers.length.toString() : "0");
        params = params.append('Take', takeAmount.toString());
        params = params.append('Search', searchTerm);

        return this.http.get<ISearchedUser[]>(`${environment.WorkflowUrl}/aggregator/api/FriendRequests/search/${searchTerm}`,{params:params}).pipe(
          tap((searchNewUsers)=>{
            if (isScroll)
              this.searchNewUsersSource$.next([...currentSearchNewUsers,...searchNewUsers]);
            else
              this.searchNewUsersSource$.next(searchNewUsers);
          })
        );

      })
    )
  }
  sendInvitation(searchUser: IUser) {
    return this.http.post<IFriendInvitation>(
      `${this.baseUrl}/api/FriendRequests`,{targetUserId:searchUser.id,targetUserEmail:searchUser.email,targetUserPhotoUrl:searchUser.photoUrl},
    ).pipe(
      mergeMap(() => this.searchNewUsers$.pipe(take(1))),
      tap((users)=>{
        const searchNewUsers = users.map((user) =>
          user.id === searchUser.id
            ? { ...user, status: UserFriendStatusType.InvitedByYou }
            : user,
        );
        this.searchNewUsersSource$.next(searchNewUsers);
      })
    );
  }
  GetReceivedFriendRequests() {

    return this.receivedFriendRequests$.pipe(
      take(1),
      mergeMap((currentReceivedFriendRequests) => {
        let params = new HttpParams();

        params = params.append('Skip',currentReceivedFriendRequests.length.toString(),);
        params = params.append('Take', "20");
        params = params.append('Search', "");

        return this.http
        .get<IFriendInvitation[]>(
          `${this.baseUrl}/api/FriendRequests/GetReceivedFriendRequests`,{params:params}
        )
        .pipe(
          take(1),
          tap((invitations) =>
            this.receivedFriendRequestsSource$.next(invitations),
          ),
        );
      }),
    );
  }

  private getFriendsWithActivityStatus(user: IUser) {
    return combineLatest([
      this.confirmedInvitations$,
      this.presenceService.onlineUsers$,
    ]).pipe(
      map(([confirmedInvitations, onlineUsers]) => {
        return confirmedInvitations.map((invitation) => {
          const friendEmail =
            invitation.inviterUserEmail === user.email
              ? invitation.invitedUserEmail
              : invitation.inviterUserEmail;
          const friendId =
            invitation.inviterUserId === user.id
              ? invitation.invitedUserId
              : invitation.inviterUserId;
          const friendPhoto =
            invitation.inviterPhotoUrl === user.photoUrl
              ? invitation.invitedPhotoUrl
              : invitation.inviterPhotoUrl;
          const person: IUser = {
            email: friendEmail,
            id: friendId,
            photoUrl: friendPhoto,
            isOnline: false,
          };
          if (onlineUsers.find((x) => x === friendEmail)) {
            person.isOnline = true;
          }
          return person;
        });
      }),
    );
  }
  acceptFriendInvitation(invitationId: {
    inviterUserId: string;
    invitedUserId: string;
  }) {
    return this.http
      .put(`${this.baseUrl}/api/FriendRequests/${invitationId.inviterUserId}`, {})
      .pipe(
        mergeMap(() => {
          return this.receivedFriendRequests$.pipe(
            take(1),
            tap((receivedFriendRequests) => {
              const newReceivedFriendRequests = receivedFriendRequests.filter(
                (receivedFriendRequest) => {
                  return !(
                    (receivedFriendRequest.inviterUserId ===
                      invitationId.invitedUserId &&
                      receivedFriendRequest.invitedUserId ===
                        invitationId.inviterUserId) ||
                    (receivedFriendRequest.inviterUserId ===
                      invitationId.inviterUserId &&
                      receivedFriendRequest.invitedUserId ===
                        invitationId.invitedUserId)
                  );
                },
              );
              this.receivedFriendRequestsSource$.next(
                newReceivedFriendRequests,
              );
            }),
          );
        }),
      );
  }
  declineFriendInvitation(invitationId: {
    inviterUserId: string;
    invitedUserId: string;
  }) {
    return this.http
      .delete(`${this.baseUrl}/api/FriendRequests/${invitationId.inviterUserId}`)
      .pipe(
        mergeMap(() => {
          return this.receivedFriendRequests$.pipe(
            take(1),
            map((invitations) => {
              const invitationIndex = invitations.findIndex((invitation) => {
                return (
                  (invitation.inviterUserId === invitationId.invitedUserId &&
                    invitation.invitedUserId === invitationId.inviterUserId) ||
                  (invitation.inviterUserId === invitationId.inviterUserId &&
                    invitation.invitedUserId === invitationId.invitedUserId)
                );
              });
              if (invitationIndex !== -1) {
                invitations.splice(invitationIndex, 1); //?? invitations.splice(invitationIndex)
                this.receivedFriendRequestsSource$.next(invitations);
              }
            }),
          );
        }),
      );
  }
  declineAcceptedFriendInvitation(friend: IUser, currentUserId: string) {
    return this.http.delete(`${this.baseUrl}/api/FriendRequests/${friend.id}`).pipe(
      take(1),
      concatMap(() =>
        combineLatest([
          this.confirmedInvitations$,
          this.presenceService.onlineUsers$,
        ]).pipe(take(1)),
      ),
      tap(([confirmedInvitations, onlineUsers]) => {
        const filteredConfirmedInvitations = confirmedInvitations.filter(
          (confirmedInvitation) =>
            !(
              (confirmedInvitation.inviterUserId === friend.id &&
                confirmedInvitation.invitedUserId === currentUserId) ||
              (confirmedInvitation.inviterUserId === currentUserId &&
                confirmedInvitation.invitedUserId === friend.id)
            ),
        );
        this.confirmedInvitationsSource$.next(filteredConfirmedInvitations);
        const filteredOnlineUsers = onlineUsers.filter(
          (email) => email !== friend.email,
        );
        this.presenceService.onlineUsersNext(filteredOnlineUsers);
      }),
    );
  }
  GetConfirmedFriendRequests(
    isScroll:boolean,
    searchTerm = '',
    takeAmount = 10,
    ) {
    return this.confirmedInvitations$.pipe(
      take(1),
      mergeMap((currentConfirmedInvitations) => {
        let params = new HttpParams();
        
        params = params.append('Skip',isScroll ? currentConfirmedInvitations.length.toString() : "0");
        params = params.append('Take', takeAmount.toString());
        params = params.append('Search', searchTerm);

        return this.http
          .get<IFriendInvitation[]>(
            `${this.baseUrl}/api/FriendRequests/GetConfirmedFriendRequests`,
            { params: params },
          )
          .pipe(
            take(1),
            tap((friends) => {
              if (isScroll)
                this.confirmedInvitationsSource$.next([...currentConfirmedInvitations,...friends]);
              else
                this.confirmedInvitationsSource$.next(friends);
            }),
          );
      }),
    );
  }
  createHubConnection(userAccessToken: string): Promise<void> {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${environment.WorkflowUrl}/hub/Messages`, {
        accessTokenFactory: () => userAccessToken,
        transport: HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.on(
      'FriendInvitationAccepted',
      (invitation: IFriendInvitation) => {
        this.confirmedInvitations$.pipe(take(1)).subscribe((invitations) => {
          this.confirmedInvitationsSource$.next([...invitations, invitation]);
        });
      },
    );
    this.hubConnection.on(
      'NewInvitationToFriendsReceived',
      (invitation: IFriendInvitation) => {
        this.receivedFriendRequests$.pipe(take(1)).subscribe((invitations) => {
          this.receivedFriendRequestsSource$.next([...invitations, invitation]);
        });
      },
    );
    this.hubConnection.on('FriendRequestRemoved', (removerEmail: string) => {
      combineLatest([
        this.confirmedInvitations$,
        this.presenceService.onlineUsers$,
      ])
        .pipe(take(1))
        .subscribe(([confirmedInvitations, onlineUsers]) => {
          const filterdConfirmedInvitations = confirmedInvitations.filter(
            (c) =>
              !(
                c.invitedUserEmail === removerEmail ||
                c.inviterUserEmail === removerEmail
              ),
          );
          this.confirmedInvitationsSource$.next(filterdConfirmedInvitations);
          const filteredOnlineUsers = onlineUsers.filter(
            (email) => email !== removerEmail,
          );
          this.presenceService.onlineUsersNext(filteredOnlineUsers);
        });
    });

    const hubConnectionState = this.hubConnection
      .start()
      .catch((error) => console.log(error))
      .finally();
    return hubConnectionState;
  }

  async stopHubConnection() {
    await this.hubConnection?.stop();
  }
}
