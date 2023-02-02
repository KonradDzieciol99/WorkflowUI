import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { map, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IFriendInvitation } from '../shared/models/IFriendInvitation';
import { IPerson } from '../shared/models/IPerson';
import { ISearchedFriend } from '../shared/models/ISearchedFriend';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  //private baseUrl = environment.apiUrl;
  private socialApiUrl = environment.socialApiUrl;
  constructor(private http: HttpClient) { }
  findUsersByEmailAndCheckState(email:string){
    return this.http.get<Array<ISearchedFriend>>(`${this.socialApiUrl}api/Users/test/${email}`);
  }
  addUserToFriends(user:IPerson){
    return this.http.post(`${this.socialApiUrl}api/FriendInvitation`,user);
  }
  getAllFriendInvitation(){
    return this.http.get<Array<IFriendInvitation>>(`${this.socialApiUrl}api/FriendInvitation/GetAllInvitations`);
  }
  acceptFriendInvitation(invitation:IFriendInvitation){
    return this.http.post(`${this.socialApiUrl}api/FriendInvitation/AcceptFriendInvitation`,invitation);
  }
  declineFriendInvitation(invitation:IFriendInvitation){
    return this.http.post(`${this.socialApiUrl}api/FriendInvitation/DeclineFriendInvitation`,invitation);
  }
  getAllFriends(){
    return this.http.get<Array<IFriendInvitation>>(`${this.socialApiUrl}api/FriendInvitation/GetAllFriends`);
  }
}
