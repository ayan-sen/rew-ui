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

export function mandatoryAndlessThanValueValidator(targetKey: string, toMatchKey: string): ValidatorFn {

  return (group: FormGroup): {[key: string]: any} => {
      const target = group.controls[targetKey];
      const toMatch = group.controls[toMatchKey];
      //if (target.touched || toMatch.touched) {
        const isLess = target.value <= toMatch.value;
        target.setErrors({mandatoryAndlessThanValue: targetKey});
        if(!toMatch.valid) {
          const message2 = targetKey + ' is required';
          return {'mandatoryAndlessThanValue': message2};
        }
        if (!isLess && target.valid && toMatch.valid) {
          const message1 = targetKey + ' should be less than ' + toMatchKey;
          return {'mandatoryAndlessThanValue': message1};
        }
        
        if (isLess && target.hasError('mandatoryAndlessThanValue')) {
          target.setErrors(null);  
        }   
      //}   
      return null;
    };
}