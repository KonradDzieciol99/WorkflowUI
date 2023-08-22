import { Component, OnInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject, Observable, forkJoin, take } from 'rxjs';
import { ISearchedUser } from '../shared/models/ISearchedUser';
import { IUser } from '../shared/models/IUser';
import { MessagesService } from './messages.service';
import { ChatService } from './services/chat.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  searchNewUsers$: Observable<Array<ISearchedUser>> ;
  searchNewUsersSource: BehaviorSubject<Array<ISearchedUser>>;
  friendsWithActivityStatus$?: Observable<IUser[]>;
  constructor(public messagesService:MessagesService,
    private readonly oAuthService: OAuthService,
    public chatService:ChatService)
  { 
    this.searchNewUsersSource = new BehaviorSubject<Array<ISearchedUser>>([]);
    this.searchNewUsers$ = this.searchNewUsersSource.asObservable();
  }

  ngOnInit(): void {
    this.messagesService.stopHubConnection();
    this.messagesService.createHubConnection(this.oAuthService.getAccessToken());

    forkJoin({
      sourceOne:this.messagesService.GetConfirmedFriendRequests().pipe(take(1)),
      sourceTwo:this.messagesService.GetReceivedFriendRequests().pipe(take(1)),
    })
    .pipe(take(1))
    .subscribe();
  }
}