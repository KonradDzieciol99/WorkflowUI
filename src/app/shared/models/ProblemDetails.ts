export class ProblemDetails {
    type?: string;
    title?: string;
    status?: number;
    detail?: string;
    instance?: string;
}

export function isProblemDetails(object: unknown): object is ProblemDetails {
 if (typeof object !== 'object' || object === null) return false;

    return 'detail' in object || 
           'type' in object || 
           'title' in object || 
           'status' in object || 
           'instance' in object;
}
