import { ISimplePerson } from "./ISimplePerson";

export interface INotification{
    id:string
    notificationRecipient: ISimplePerson;
    notificationSender: ISimplePerson;
    messageCreated?: Date;
    //content:string,
    eventType: EventType
}
export function isINotification(notificationValue:any): notificationValue is INotification {
    return 'notificationRecipient' in notificationValue && 'notificationSender' in notificationValue 
                    && 'eventType' in notificationValue;
}
export enum EventType {
    FriendInvitationAcceptedEvent = "FriendInvitationAcceptedEvent",
    InviteUserToFriendsEvent = "InviteUserToFriendsEvent",
}

