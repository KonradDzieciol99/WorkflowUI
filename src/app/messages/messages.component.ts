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
  searchNewUsers$: Observable<ISearchedUser[]> ;
  private searchNewUsersSource$: BehaviorSubject<ISearchedUser[]>;
  friendsWithActivityStatus$?: Observable<IUser[]>;
  constructor(public messagesService:MessagesService,
    private readonly oAuthService: OAuthService,
    public chatService:ChatService)
  { 
    this.searchNewUsersSource$ = new BehaviorSubject([] as ISearchedUser[]);
    this.searchNewUsers$ = this.searchNewUsersSource$.asObservable();
  }

  async ngOnInit() {
  
    forkJoin({
      sourceOne$:this.messagesService.GetConfirmedFriendRequests().pipe(take(1)),
      sourceTwo$:this.messagesService.GetReceivedFriendRequests().pipe(take(1)),
    })
    .pipe(take(1))
    .subscribe();

    await this.messagesService.stopHubConnection();
    await this.messagesService.createHubConnection(this.oAuthService.getAccessToken());
    
  }
}