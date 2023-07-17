export interface INotification{ //raneme to IAppNotification
    id:string
    userId:string
    //objectId:any
    //eventType: EventType
    //data:any
    creationDate:Date;
    notificationType: NotificationType;
    displayed: boolean;
    description:string
    notificationPartnerEmail?:string,
    notificationPartnerId?:string,
    notificationPartnerPhotoUrl?:string,
}
// export function isINotification(notificationValue:any): notificationValue is INotification {
//     return 'notificationRecipient' in notificationValue && 'notificationSender' in notificationValue 
//                     && 'eventType' in notificationValue;
// }
export function isINotification(notificationValue:any): notificationValue is INotification {
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
    TEST
};


// export enum NotificationType {
//     FriendRequestSent,
//     FriendRequestReceived,
//     NewFriendAdded,
//     WelcomeNotification,
//     RemovedFromFriend,
//     YouDeletedFriend
// }

// export enum NotificationType {
//     FriendRequestSent = "FriendRequestSent",
//     FriendRequestReceived = "FriendRequestReceived",
//     NewFriendAdded = "NewFriendAdded",
//     WelcomeNotification = "WelcomeNotification",
//     RemovedFromFriend = "RemovedFromFriend",
//     YouDeletedFriend = "YouDeletedFriend",
// }

