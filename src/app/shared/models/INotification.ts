import { ISimplePerson } from "./ISimplePerson";

export interface INotification{
    notificationRecipient: ISimplePerson;
    notificationSender: ISimplePerson;
    messageCreated?: Date;
    //content:string,
    eventType: EventType
}

export enum EventType {
    FriendInvitationAcceptedEvent = "FriendInvitationAcceptedEvent",
    InviteUserToFriendsEvent = "InviteUserToFriendsEvent",
}