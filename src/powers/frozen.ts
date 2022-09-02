import { UPDATES_PER_SECOND } from "../game";
import { PowerType } from "../models";
import { DefaultPower } from "./default-power"

export class FrozenPower extends DefaultPower {
  type: PowerType = 'frozen';
  remainingTime = UPDATES_PER_SECOND * 5;

  override getCanMove() {
    return false;
  }
}
