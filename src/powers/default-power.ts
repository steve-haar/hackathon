import { PowerType } from "../models";

export class DefaultPower {
  type: PowerType = 'default';
  remainingTime = Number.POSITIVE_INFINITY;
  
  getIsInvincible() {
    return false;
  }
}
