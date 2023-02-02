import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OAuthService } from 'angular-oauth2-oidc';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, Observable, of, switchMap, take } from 'rxjs';
import { IFriendInvitation } from '../shared/models/IFriendInvitation';
import { IPerson } from '../shared/models/IPerson';
import { ISearchedFriend } from '../shared/models/ISearchedFriend';
import { IUser } from '../shared/models/IUser';
import { MessagesService } from './messages.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

  messagesForm: FormGroup = new FormGroup({
    searchNewUsers: new FormControl<string>('',[]),
  });
  custom="border border-0";
  searchNewUsers$: Observable<Array<ISearchedFriend>> ;
  invitations$: Observable<Array<IFriendInvitation>> ;
  friends$: Observable<Array<IFriendInvitation>> ;
  userClaims: Record<string, any>;
  
  constructor(private messagesService:MessagesService,
    private toastrService: ToastrService,
    private readonly oAuthService: OAuthService)
    {
      this.searchNewUsers$ = new Observable<Array<ISearchedFriend>>();
      this.invitations$ = new Observable<Array<IFriendInvitation>>();
      this.friends$ = new Observable<Array<IFriendInvitation>>();
      this.userClaims = this.oAuthService.getIdentityClaims();
      
    }


  ngOnInit(): void {

    this.searchNewUsers$=this.messagesForm.controls['searchNewUsers'].valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string)=>this.messagesService.findUsersByEmailAndCheckState(term).pipe(take(1)))
    );

    this.invitations$=this.messagesService.getAllFriendInvitation().pipe(take(1));

    this.friends$=this.messagesService.getAllFriends().pipe(take(1));
  }
  addUserToFriends(searchUser:ISearchedFriend){

    let user:IPerson={
      email: searchUser.email,
      id: searchUser.id
    }

    this.messagesService.addUserToFriends(user).pipe(
      take(1),
    ).subscribe(()=>{
      this.toastrService.success("The invitation has been sent.")
      searchUser.isAlreadyInvited=true;
    });
    
  }
  acceptFriendInvitation(invitation:IFriendInvitation){
    this.messagesService.acceptFriendInvitation(invitation).subscribe(()=>{
      this.toastrService.success("Invitation accepted.")
    });
  }
  declineFriendInvitation(invitation:IFriendInvitation){
    this.messagesService.declineFriendInvitation(invitation).subscribe(()=>{
      this.toastrService.success("Invitation canceled.")
    });
  }
}
