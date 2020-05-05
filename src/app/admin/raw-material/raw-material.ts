import { Unit } from '../unit/unit';

export class RawMaterial {
  code : string;
  name : string;
  hsnSacCode : string;
  unitId : string;
  unitName : string;
  isActive : boolean;
  unit : Unit;
}