import { Priority, State } from "./IAppTask"
import { IProjectMember } from "./IProjectMember";

export interface ICreateAppTask {
    name:string
    description?:string
    projectId:string 
    priority:Priority
    state:State
    dueDate:Date
    startDate:Date, 
    taskLeaderId?:string,
    taskLeader?:IProjectMember,
    taskAssigneeMemberId?:string,
    taskAssignee?:IProjectMember,
    
}

// export interface ICreateAppTask {
//     name:string
//     description?:string
//     projectId:string 
//     taskAssigneeMemberId?:string
//     // taskAssigneeMemberEmail?:string
//     // taskAssigneeMemberPhotoUrl?:string
//     priority:Priority
//     state:State
//     dueDate:Date
//     startDate:Date,
//     taskLeaderId?:string,
// }