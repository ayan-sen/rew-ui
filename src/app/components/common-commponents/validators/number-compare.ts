import { ValidatorFn, FormGroup } from '@angular/forms';

export function lessThanValueValidator(targetKey: string, toMatchKey: string): ValidatorFn {

    return (group: FormGroup): {[key: string]: any} => {
        const target = group.controls[targetKey];
        const toMatch = group.controls[toMatchKey];
        //if (target.touched || toMatch.touched) {
          const isLess = target.value <= toMatch.value;
          // set equal value error on dirty controls
          if (!isLess && target.valid && toMatch.valid) {
            target.setErrors({lessThanValue: targetKey});
            const message = targetKey + ' should be less than ' + toMatchKey;
            return {'lessThanValue': message};
          }
          if (isLess && target.hasError('lessThanValue')) {
            target.setErrors(null);  
          }   
        //}   
        return null;
      };
}