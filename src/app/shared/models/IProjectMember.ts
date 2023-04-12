export interface IProjectMember{
    //photoUrl?: string;
    id:string,
    userId:string,
    userEmail:string,
    type:ProjectMemberType
    projectId:string,
    photoUrl:string
}
export enum ProjectMemberType {
    Leader,
    Admin,
    Member
}
