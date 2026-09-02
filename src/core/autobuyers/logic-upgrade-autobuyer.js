import { AutobuyerState } from "./autobuyer";

export class LogicUpgradeAutobuyerState extends AutobuyerState {
  get data() {
    return player.auto.logicUpgrade;
  }

  get name() {
    return `Logic Upgrade Autobuyer`;
  }

  get isUnlocked() {
    return LogicNode.logicUpgradeAutobuyer.isUnlocked;
  }

  get hasUnlimitedBulk() {
    return true;
  }
  
  purchaseSelected(id) {
    return (this.data.selectedBits & (1 << id)) !== 0;
  }
  
  get resetTickOn() {
    return PRESTIGE_EVENT.ETERNITY;
  }

  tick() {
    for (const upgrade of LogicUpgrades.all) {
      if (
        !upgrade.isBought &&
        this.purchaseSelected(upgrade.id) &&
        upgrade.canBeBought
      ) {
        upgrade.purchase();
      }
    }
  }
}