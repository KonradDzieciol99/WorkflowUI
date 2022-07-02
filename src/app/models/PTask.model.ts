import { User } from "./User.model"

export interface PTask {
    id:number
    startDate:Date
    endDate:Date
    title:string
    description:string
    priorityId:number
    stateId:number
    teamId:number
    Performer:User
}
