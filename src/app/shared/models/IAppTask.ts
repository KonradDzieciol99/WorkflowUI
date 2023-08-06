import { IProjectMember } from "./IProjectMember";

export interface IAppTask {
    id:string;
    name:string
    description?:string
    projectId:string 
    // taskAssigneeMemberId?:string
    // taskAssigneeMemberEmail?:string
    // taskAssigneeMemberPhotoUrl?:string
    priority:Priority
    state:State
    dueDate:Date
    startDate:Date, 
    taskLeaderId?:string,
    taskLeader?:IProjectMember,
    taskAssigneeMemberId?:string,
    taskAssignee?:IProjectMember,
}

export enum Priority {
    Low,
    Medium,
    High
}
export enum State {
    ToDo,
    InProgress,
    Done
 }
//  export enum Priority {
//     Leader,
//     Admin,
//     Member
// }