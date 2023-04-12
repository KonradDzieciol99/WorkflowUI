import { IProjectMember } from "./IProjectMember";

export interface IProject{
    name: string;
    id:string,
    iconUrl:string,
    projectMembers:Array<IProjectMember>,
    leader:IProjectMember
}