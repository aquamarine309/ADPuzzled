import { BitPurchasableMechanicState } from "./game-mechanics";
import { DC } from "./constants";

class LogicUpgradeState extends BitPurchasableMechanicState {
  constructor(config) {
    super(config);
    this.registerEvents(config.checkEvent, () => this.tryUnlock());
  }

  get requirement() {
    return typeof this.config.requirement === "function" ? this.config.requirement() : this.config.requirement;
  }

  get currency() {
    return Currency.logicPoints;
  }

  get name() {
    return this.config.name;
  }

  get bitIndex() {
    return this.id;
  }

  get bits() {
    return player.logic.upgradeBits;
  }

  set bits(value) {
    player.logic.upgradeBits = value;
  }

  get isAvailableForPurchase() {
    return (player.logic.upgReqs & (1 << this.id)) !== 0;
  }

  get isPossible() {
    return this.config.hasFailed ? !this.config.hasFailed() : true;
  }

  tryUnlock() {
    const logicUnlocked = PlayerProgress.infinityUnlocked();
    if (!logicUnlocked || this.isAvailableForPurchase || !this.config.checkRequirement()) return;
    player.logic.upgReqs |= (1 << this.id);
    GameUI.notify.logic(`You've unlocked a Logic Upgrade: ${this.config.name}`);
  }
  
  purchase() {
    if (!this.canBeBought) return false;
    this.isBought = true;
    this.onPurchased();
    GameCache.spentLogicPoints.invalidate();
    GameUI.update();
    return true;
  }

  onPurchased() {
    const id = this.id;
    if (id <= 7) {
      GameCache.maxTier.invalidate();
    }
  }
}

LogicUpgradeState.index = mapGameData(
  GameDatabase.logic.upgrades,
  config => new LogicUpgradeState(config)
);

export const LogicUpgrade = id => LogicUpgradeState.index[id];

export const LogicUpgrades = {
  /**
   * @type {LogicUpgradeState[]}
   */
  all: LogicUpgradeState.index.compact(),

  reset() {
    player.logic.upgradeBits = 0;
    player.logic.upgReqs = 0;
    GameCache.spentLogicPoints.invalidate();
    GameCache.logicPoints.invalidate();
    GameCache.maxTier.invalidate();
  }
};