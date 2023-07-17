export interface ISearchedUser{
    photoUrl?: string;
    email: string;
    id:string,
   // isAlreadyInvited:boolean,
    //confirmed:boolean,
    status:UserFriendStatusType
}
//status: invited,friend,nieznajomy ?

export enum UserFriendStatusType
{
    Stranger,
    InvitedByYou,
    InvitedYou,
    Friend
}