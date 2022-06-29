import { User } from "./User.model"

export interface PTask {
    id:number
    StartDate:Date
    EndDate:Date
    Title:string
    Description:string
    Priority:number
    State:number
    performer:User
}
