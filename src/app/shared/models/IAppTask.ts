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
export function isIAppTask(data: unknown): data is IAppTask {
    if (typeof data !== 'object' || data === null) return false;

    return 'id' in data 
        && 'name' in data 
        && 'projectId' in data
        && 'priority' in data
        && 'state' in data
        && 'dueDate' in data
        && 'startDate' in data;
}