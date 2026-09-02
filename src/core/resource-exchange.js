import { GameMechanicState } from "./game-mechanics/index.js";
import { DC } from "./constants.js";

class ResourceExchangeState extends GameMechanicState {
  get currency() {
    return this.config.currency();
  }

  get data() {
    return player.logic.resourceExchange.all[this.id];
  }

  get exchangeRate() {
    return this.data.rate;
  }

  set exchangeRate(value) {
    this.data.rate = value;
  }

  get valueFn() {
    return this.config.value;
  }

  get min() {
    return this.config.min ?? DC.D0;
  }

  get notEnough() {
    return this.newExchanged.minus(this.exchangedAmount).lt(1e-3);
  }

  get canExchange() {
    return this.isUnlocked && this.currency.gt(this.min) && !this.notEnough && PlayerProgress.infinityUnlocked();
  }

  exchange() {
    if (!this.canExchange) return false;
    const leave = this.willLeave;
    this.exchangedAmount = this.newExchanged;
    if (!LogicNode.freeExchange.isUnlocked) {
      this.currency.value = leave;
    }
    ResourceExchange.chachedPoints.invalidate();
    player.requirementChecks.eternity.noExchange = false;
    return true;
  }

  get willLeave() {
    return this.currency.value.times(1 - this.exchangeRate).clampMin(this.min);
  }

  get newExchanged() {
    return this.currency.value.minus(this.willLeave).add(this.exchangedAmount);
  }

  get exchangedAmount() {
    if (EternityChallenge.isRunning) return this.data.ecValue;
    return this.data.value;
  }
  
  set exchangedAmount(value) {
    if (EternityChallenge.isRunning) {
      this.data.ecValue = value;
      return;
    }
    this.data.value = value;
  }

  get value() {
    if (this.isPower) return Math.clampMin(this.valueFn(this.exchangedAmount), 1);
    return this.valueFn(this.exchangedAmount).clampMin(1);
  }

  get afterExchangeValue() {
    if (this.isPower) return Math.clampMin(this.valueFn(this.newExchanged), 1);
    return this.valueFn(this.newExchanged).clampMin(1);
  }

  get requiredLevel() {
    return this.id + 1;
  }

  get isUnlocked() {
    return ResourceExchangeUpgrade.boughtAmount >= this.id;
  }

  get symbol() {
    return this.isUnlocked ? this.config.symbol : "?";
  }

  get name() {
    return this.config.name;
  }

  get shortName() {
    return this.config.shortName;
  }
  
  get isPower() {
    return this.id === 5;
  }

  reset() {
    this.data.exchangedAmount = DC.D0;
    player.logic.resourceExchange.lastSelected = 0;
    if (EternityMilestone.autobuyerID2.isReached) return;
    this.exchangeRate = 1;
  }
}

export const ResourceExchange = mapGameDataToObject(
  GameDatabase.logic.resourceExchange,
  config => new ResourceExchangeState(config)
);

Object.defineProperty(ResourceExchange, "selected", {
  get() {
    return this.all[player.logic.resourceExchange.lastSelected];
  }
});

ResourceExchange.chachedPoints = new Lazy(() => {
  let mult = DC.D1;
  let power = 1;
  for (const exchange of ResourceExchange.all) {
    if (exchange.isPower) power *= exchange.value;
    else mult = mult.mul(exchange.value);
  }
  return mult.pow(power);
});

export function getLogicPoints() {
  let points = ResourceExchange.chachedPoints.value;
  points = points.timesEffectOf(TenseBoost.logicBoost);
  return points;
}

export function getSpentLogicPoints() {
  const fromLU = LogicUpgrades.all.filter(x => x.isBought).map(x => x.cost).reduce(Decimal.sumReducer, DC.D0);
  const levelUpg = ResourceExchangeUpgrade;
  const fromLevel = Array.range(0, levelUpg.boughtAmount)
    .reduce((a, b) => a.add(levelUpg.costAfterCount(b)), DC.D0);
  return fromLU.add(fromLevel);
}

class ResourceExchangeUpgradeState extends GameMechanicState {
  constructor() {
    super({});
    this.cachedCost = new Lazy(() => this.costAfterCount(this.boughtAmount));
  }

  get cost() {
    return this.cachedCost.value;
  }

  get isAffordable() {
    return this.currency.gte(this.cost);
  }

  get boughtAmount() {
    if (EternityChallenge.isRunning) {
      return player.logic.resourceExchange.ecLevel;
    }
    return player.logic.resourceExchange.level;
  }

  set boughtAmount(value) {
    if (EternityChallenge.isRunning) {
      player.logic.resourceExchange.ecLevel = value;
    } else {
      player.logic.resourceExchange.level = value;
    }
    this.cachedCost.invalidate();
  }

  get level() {
    return this.boughtAmount + 1;
  }

  get currency() {
    return Currency.logicPoints;
  }

  get isCustomEffect() {
    return true;
  }

  costAfterCount(count) {
    return Decimal.pow10(1 + 10 * count + Math.pow(20, count) / 15).div(2);
  }

  purchase() {
    if (!this.isAffordable) return;
    ++this.boughtAmount;
    GameCache.spentLogicPoints.invalidate();
    EventHub.dispatch(GAME_EVENT.EXCHANGE_LEVEL_UP);
  }

  get effectValue() {
    if (LogicChallenge(5).isRunning) return DC.D1;
    let effectivePoints = getLogicPoints();
    if (effectivePoints.gte(DC.E50)) effectivePoints = DC.E45.times(effectivePoints.pow(0.1));
    return DC.E5.pow(
      Decimal.pow(
        this.boughtAmount + 1,
        Math.log10(effectivePoints.add(1).log10() + 1) + 1
      ).timesEffectOf(LogicChallenge(3))
    );
  }

  get isEffectActive() {
    return PlayerProgress.infinityUnlocked();
  }

  reset() {
    this.boughtAmount = 0;
    GameCache.spentLogicPoints.invalidate();
    EventHub.dispatch(GAME_EVENT.EXCHANGE_LEVEL_UP);
  }
}

export const ResourceExchangeUpgrade = new ResourceExchangeUpgradeState();

export function resetAllResourceExchange() {
  ResourceExchange.all.forEach(r => r.reset());
  ResourceExchange.chachedPoints.invalidate();
}