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

export function mandatoryAndlessThanValueValidator(quantityVar: string, availableQuantityVar: string, 
  remainingQuantityVar : string, itemTypeVar : string, processTypeVar : string): ValidatorFn {

  return (group: FormGroup): {[key: string]: any} => {
      const quantity = group.controls[quantityVar];
      const availableQuantity = group.controls[availableQuantityVar];
      const remainingQuantity = group.controls[remainingQuantityVar];
      const itemType = group.controls[itemTypeVar];
      const processType = group.controls[processTypeVar];

      if(quantity.valid && availableQuantity.valid && remainingQuantity.valid && itemType.valid && processType.valid) {

        if(itemType.value == "P" &&  quantity.value > remainingQuantity.value) {
          const message = quantity + ' should be less than or equal to remaining quantity';
          quantity.setErrors({mandatoryAndlessThanValue: quantity});
          return {'mandatoryAndlessThanValue': message};
        }

        if(itemType.value == "R" &&  quantity.value > availableQuantity.value) {
          const message = quantity + ' should be less than or equal to available quantity';
          quantity.setErrors({mandatoryAndlessThanValue: quantity});
          return {'mandatoryAndlessThanValue': message};
        }

        if(itemType.value == "S" && processType.value == "OUT" &&  quantity.value > availableQuantity.value) {
          const message = quantity + ' should be less than or equal to available quantity';
          quantity.setErrors({mandatoryAndlessThanValue: quantity});
          return {'mandatoryAndlessThanValue': message};
        }
      }
      if (quantity.hasError('mandatoryAndlessThanValue')) {
        quantity.setErrors(null);  
      } 
      return null;
    };
}