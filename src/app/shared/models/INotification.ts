export interface INotification{ 
    id:string,
    userId:string,
    creationDate:Date,
    notificationType: NotificationType,
    displayed: boolean,
    description:string,
    notificationPartnerEmail:string,
    notificationPartnerId:string,
    notificationPartnerPhotoUrl:string,
    oldNotificationsIds?:Array<string>

}
export function isINotification(notificationValue:INotification): notificationValue is INotification {
    return 'notificationType' in notificationValue && 'displayed' in notificationValue;
}
export enum EventType {
    FriendInvitationAcceptedEvent = "FriendInvitationAcceptedEvent",
    InviteUserToFriendsEvent = "InviteUserToFriendsEvent",
}
export enum NotificationType
{
    FriendRequestSent,
    FriendRequestReceived,
    FriendRequestAccepted,
    WelcomeNotification,
    RemovedFromFriend,
    RemovedFromFriendByYou,
    InvitationDeclined,
    InvitationDeclinedByYou,
    InvitationToProjectRecived,
    InvitationToProjectDeclined,
    InvitationToProjectAccepted
}