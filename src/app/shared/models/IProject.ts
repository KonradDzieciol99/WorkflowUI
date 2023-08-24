import { isArrayOfType } from "../functions/isArrayOfType";
import { IProjectMember, isIProjectMember } from "./IProjectMember";

export interface IProject{
    name: string;
    id:string,
    iconUrl:string,
    projectMembers:IProjectMember[],
}

export function isIProject(item: unknown): item is IProject {
    if (typeof item !== 'object' || item === null) return false;

    return 'name' in item 
        && 'id' in item 
        && 'iconUrl' in item 
        && 'projectMembers' in item ;
        //&& isArrayOfType(item.projectMembers, isIProjectMember);
}

