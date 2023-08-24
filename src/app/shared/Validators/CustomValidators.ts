import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

export class CustomValidators {
    static minimumDateNgb(minDate: NgbDateStruct): ValidatorFn {  
        return (control:AbstractControl<NgbDateStruct>): ValidationErrors | null => {
            
            const controlDate = new Date(control.value.year, control.value.month, control.value.day, 0, 0, 0, 0);

            const test = Date.parse(controlDate.toString());
            if (isNaN(test)) 
                return null;
            
            const minDateTime = new Date(minDate.year, minDate.month, minDate.day, 0, 0, 0, 0);
            const result = controlDate >= minDateTime ? null : {minimumDateNgb: control.value};
            return result;
        };
    }
    static checkDateOrder(): ValidatorFn {
        return (control:AbstractControl<{dueDate: NgbDateStruct,startDate: NgbDateStruct}>): ValidationErrors | null => {
            const dueDate = control.get('dueDate')?.value;
            if (!dueDate)
                return null;

            const dueDateDate = new Date(dueDate.year, dueDate.month, dueDate.day, 0, 0, 0, 0);
            const dueDateDatetest = Date.parse(dueDateDate.toString());
            if (isNaN(dueDateDatetest)) 
                return null;

            const startDate = control.get('startDate')?.value;
            if (!startDate)
                return null;

            const startDateDate = new Date(startDate.year, startDate.month, startDate.day, 0, 0, 0, 0);
            const startDateDatetest = Date.parse(startDateDate.toString());
            if (isNaN(startDateDatetest)) 
                return null;
        
            const result = dueDateDate > startDateDate ? null : { 'checkDateOrder': true };

            return result;
        }
    }
}