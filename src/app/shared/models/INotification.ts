import { ISimplePerson } from "./ISimplePerson";

export interface INotification{ //raneme to IAppNotification
    id:string
    userId:string
    objectId:string
    eventType: EventType
    data:any
    creationDate:Date;
    notificationType: NotificationType;
    displayed: boolean;
    notificationPartner:ISimplePerson
    description:string
}
// export function isINotification(notificationValue:any): notificationValue is INotification {
//     return 'notificationRecipient' in notificationValue && 'notificationSender' in notificationValue 
//                     && 'eventType' in notificationValue;
// }
export function isINotification(notificationValue:any): notificationValue is INotification {
    return 'notificationType' in notificationValue && 'displayed' in notificationValue 
                    && 'eventType' in notificationValue;
}
export enum EventType {
    FriendInvitationAcceptedEvent = "FriendInvitationAcceptedEvent",
    InviteUserToFriendsEvent = "InviteUserToFriendsEvent",
}

export enum NotificationType {
    FriendRequestSent = "FriendRequestSent",
    FriendRequestReceived = "FriendRequestReceived",
    NewFriendAdded = "NewFriendAdded"
}

