import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

export class CustomValidators {
    // static passwordMatch(formGroup: AbstractControl) {
    //     if (formGroup.get("password")?.value === formGroup.get("repeatedPassword")?.value)
    //     {
    //         formGroup.get("repeatedPassword")?.setErrors(null)
    //         return null
    //     }
    //     formGroup.get("repeatedPassword")?.setErrors({passwordMatch:true})
    //     return { passwordMatch: true };
    // } 
    // static blue(): ValidatorFn {  
    //     return (control: AbstractControl): { [key: string]: any } | null => {
    //         return control.value?.toLowerCase() === 'blue' ? null : {wrongColor: control.value};
    //     }
    // }
    static minimumDateNgb(minDate: NgbDateStruct): ValidatorFn {  
        return (control: AbstractControl<any>): { [key: string]: any } | null => {

            if (!control.value)
                return null;
            
            const controlDate = new Date(control.value.year, control.value.month, control.value.day, 0, 0, 0, 0);

            var test = Date.parse(controlDate.toString());
            if (isNaN(test)) 
                return null;
            
            const minDateTime = new Date(minDate.year, minDate.month, minDate.day, 0, 0, 0, 0);
            let result = controlDate >= minDateTime ? null : {minimumDateNgb: control.value};
            return result;
        };
    }
    static checkDateOrder(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const dueDate = control.get('dueDate')?.value;
            if (!control.value)
                return null;

            const dueDateDate = new Date(dueDate.year, dueDate.month, dueDate.day, 0, 0, 0, 0);
            var dueDateDatetest = Date.parse(dueDateDate.toString());
            if (isNaN(dueDateDatetest)) 
                return null;

            const startDate = control.get('startDate')?.value;
            if (!control.value)
                return null;

            const startDateDate = new Date(startDate.year, startDate.month, startDate.day, 0, 0, 0, 0);
            var startDateDatetest = Date.parse(startDateDate.toString());
            if (isNaN(startDateDatetest)) 
                return null;
        
            const result = dueDateDate > startDateDate ? null : { 'checkDateOrder': true };

            // if (result !== null) {
            //     control.get('dueDate')?.setErrors({ 'checkDateOrder': true });
            //     control.get('startDate')?.setErrors({ 'checkDateOrder': true });
            // }else{
            // }

            return result;
        }
    }
    // static minimumDateNgb(minDate: NgbDate): ValidatorFn {  
    //     return (control: AbstractControl<NgbDate>): { [key: string]: any } | null => {
    //         const controlDate = control.value;
    //         if (controlDate === null) {
    //             return {invalidDate: {value: control.value}};
    //         }
    
    //         const isBeforeMinDate = controlDate.year < minDate.year
    //             || controlDate.year === minDate.year && controlDate.month < minDate.month
    //             || controlDate.year === minDate.year && controlDate.month === minDate.month && controlDate.day < minDate.day;
            
    //         return !isBeforeMinDate ? null : {minDate: {value: control.value}};
    //     }
    // }
    // static minimumDateNgb(minDate: NgbDate): ValidatorFn {  
    //     return (control: AbstractControl<NgbDate>): { [key: string]: any } | null => {

    //         return control.value?.toLowerCase() === 'blue' ? null : {wrongColor: control.value};
    //     }
    // }
    // static ValidatePhone(control: AbstractControl): ValidatorFn  {
    //     return function (control: AbstractControl): { [key: string]: boolean } | null {
    //         if (control.value && control.value.length != 10) {
    //             return { phoneNumberInvalid: true };
    //         }
    //         return null;
    //     };
    //   }
    // static MyCustomValidator(control: AbstractControl){  

    //     // check if value is valid or not  
    //     const isValid = // ...some logic here
      
    //     // returns null if value is valid, or an error message otherwise  
    //     return isValid ? null : { 'myCustomError': 'This value is invalid' };  
    //   }
    // static passwordMatch(): ValidatorFn {
    //     return (formGroup: AbstractControl): ValidationErrors | null => {
    //     if (formGroup.get("password")?.value === formGroup.get("repeatedPassword")?.value)
    //     {
    //         return null
    //     }
    //     return { passwordMatch: true };
    //     }
    // } 
    // static color(colorName: string): ValidatorFn {
    //     return (control: AbstractControl): { [key: string]: any } | null =>
    //         control.value?.toLowerCase() === colorName
    //             ? null : { wrongColor: control.value };
    // }
    // static createPasswordStrengthValidator(control: AbstractControl<any, any>): ValidationErrors | null {
    // const value = control.value;
    // if (!value) {
    //     return null;
    // }
    // const hasUpperCase = /[A-Z]+/.test(value);

    // const hasLowerCase = /[a-z]+/.test(value);

    // const hasNumeric = /[0-9]+/.test(value);

    // const passwordValid = hasUpperCase && hasLowerCase && hasNumeric;
    // var ddd = !passwordValid ? { passwordStrengthv: true } : null;
    // return !passwordValid ? { passwordStrengthv: true } : null;
    // }

    // static blue(control: AbstractControl): any | null {
    //     return CustomValidators.color('blue')(control);
    // }

    // static red(control: AbstractControl): any | null {
    //     return CustomValidators.color('red')(control);
    // }

    // static white(control: AbstractControl): any | null {
    //     return CustomValidators.color('white')(control);
    // }

    // static color(colorName: string): ValidatorFn {
    //     return (control: AbstractControl): { [key: string]: any } | null =>
    //         control.value?.toLowerCase() === colorName
    //             ? null : { wrongColor: control.value };
    // }
}