import { AutobuyerState } from "./autobuyer";

export class LevelUpAutobuyerState extends AutobuyerState {
  get data() {
    return player.auto.levelUp;
  }

  get name() {
    return `Level Up Exchange`;
  }

  get isUnlocked() {
    return EternityMilestone.autobuyerIPMult.isReached && !Pelle.isDoomed;
  }

  get hasUnlimitedBulk() {
    return true;
  }

  tick() {
    ResourceExchangeUpgrade.purchase();
  }
}