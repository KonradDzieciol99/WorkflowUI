import { ProblemDetails, isProblemDetails } from "./ProblemDetails";

export class ValidationProblemDetails extends ProblemDetails {
    errors?: { [key: string]: string[] };
}


export function isValidationProblemDetails(object: any): object is ValidationProblemDetails {
    return isProblemDetails(object) && 'errors' in object;
}