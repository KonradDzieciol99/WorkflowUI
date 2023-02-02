export interface IFriendInvitation{
      inviterUserId:string,
      inviterUserEmail:string, 
      inviterPhotoUrl?:string,
      invitedUserId:string,
      invitedUserEmail:string,
      invitedPhotoUrl?:string,
      confirmed:boolean 
}