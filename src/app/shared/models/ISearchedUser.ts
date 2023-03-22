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
    Stranger = 1,
    InvitedByYou = 2,
    InvitedYou = 3,
    Friend = 4
}