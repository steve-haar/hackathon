import { UPDATES_PER_SECOND } from "../game";
import { PowerType } from "../models";
import { DefaultPower } from "./default-power"

export class InvinciblePower extends DefaultPower {
  type: PowerType = 'invincible';
  remainingTime = UPDATES_PER_SECOND * 10;

  override getIsInvincible() {
    return true;
  }
}
