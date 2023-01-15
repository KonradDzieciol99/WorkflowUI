import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
    static passwordMatch(formGroup: AbstractControl) {
        if (formGroup.get("password")?.value === formGroup.get("repeatedPassword")?.value)
        {
            formGroup.get("repeatedPassword")?.setErrors(null)
            return null
        }
        formGroup.get("repeatedPassword")?.setErrors({passwordMatch:true})
        return { passwordMatch: true };
    } 
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