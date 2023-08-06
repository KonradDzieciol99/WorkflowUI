export interface IProjectMember{
    //photoUrl?: string;
    id:string,
    userId:string,
    userEmail:string,
    type:ProjectMemberType,
    invitationStatus:InvitationStatus,
    projectId:string,
    photoUrl?:string
}
export enum ProjectMemberType {
    Leader,
    Admin,
    Member
}
export enum InvitationStatus {
    Invited,
    Accepted
}
