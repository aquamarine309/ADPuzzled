import { DimensionState } from "./dimension";
import { DC } from "../constants";
import FullScreenAnimationHandler from "../full-screen-animation-handler";

export function getAxiomBonus() {
  return Currency.axioms.value.pow(getAxiomPower()).add(1);
}

export function getAxiomPower() {
  return 2 * (Math.pow(Crisis.crises, 2) + 1);
}

export const Crisis = {
  get crises() {
    return player.crises;
  },
  
  set crises(value) {
    player.crises = value;
  },
  
  get requirement() {
    return Decimal.pow10(4 * Math.pow(3, this.crises));
  },
  
  get bulk() {
    if (!this.canTrigger) return 0;
    return Math.floor(Math.log(Currency.axioms.value.log10() / 4) / Math.log(3)) - this.crises + 1;
  },
  
  get canTrigger() {
    return Currency.axioms.value.gte(this.requirement);
  },
  
  get penalty() {
    return DC.D3.pow(Math.pow(this.crises, 1.5));
  },
  
  debounce: false,
  
  requestTrigger() {
    if (!this.canTrigger || this.debounce) return;
    this.debounce = true;
    FullScreenAnimationHandler.display("a-crisis-intense", 2);
    setTimeout(() => {
      this.trigger();
      this.debounce = false;
    }, 2000);
  },
  
  trigger() {
    if (!this.canTrigger) return;
    this.crises += this.bulk;
    LogicDimensions.respecAll();
    Currency.axioms.reset();
  }
}

class LogicDimensionState extends DimensionState {
  constructor(tier) {
    super(() => player.dimensions.logic, tier);
    const COST_COL = [1, 2, 3, 5, 8, 10, 15, 20][this.tier - 1];
    this.costCol = COST_COL;
    this.spent = new Lazy(() => this.totalCost(this.bought));
  }
  
  get cost() {
    const c = this.costCol;
    const x = this.bought;
    return c * x + 1;
  }
  
  totalCost(bought) {
    return this.costCol * bought * (bought - 1) / 2 + bought;
  }
  
  get antiatom() {
    return Antiatom(this.tier);
  }
  
  get multiplier() {
    let multiplier = DC.E1.pow(this.bought);
    multiplier = multiplier.div(Crisis.penalty);
    multiplier = multiplier.timesEffectOf(ExtraBonus.extraBonusToLD);
    multiplier = multiplier.times(this.antiatom.energyBoost);
    return multiplier.clampMin(1);
  }
  
  get rateOfChange() {
    return DC.D0;
  }
  
  get isUnlocked() {
    if (!this.antiatom) return false;
    return this.antiatom.level >= 1;
  }
  
  get isAffordable() {
    return this.antiatom.amount - this.spent.value >= this.cost;
  }
  
  buyOne() {
    if (!this.isAffordable) return;
    this.bought++;
    this.amount = this.amount.add(1);
    this.spent.invalidate();
  }
  
  get canRespec() {
    return this.bought > 0;
  }
  
  respec() {
    if (!this.canRespec) return;
    this.bought = 0;
    this.amount = DC.D0;
    bigCrunchReset(true, false);
    this.spent.invalidate();
  }
  
  get productionPerSecond() {
    return this.amount.mul(this.multiplier);
  }
  
  tick(diff) {
    if (!this.isUnlocked) return;
    if (this.tier === 1) this.produceCurrency(Currency.axioms, diff);
    else this.produceDimensions(LogicDimension(this.tier - 1), diff);
  }
}

export const LogicDimension = LogicDimensionState.createAccessor();

export const LogicDimensions = {
  all: LogicDimension.index.compact(),
  
  tick(diff) {
    for (let i = 8; i >= 1; i--) {
      LogicDimension(i).tick(diff);
    }
  },
  
  respecAll() {
    let hasRespeced = false;
    for (let i = 8; i >= 1; i--) {
      const dim = LogicDimension(i);
      if (dim.canRespec) {
        hasRespeced = true;
        dim.bought = 0;
        dim.amount = DC.D0;
        dim.spent.invalidate();
      }
    }
    if (hasRespeced) bigCrunchReset(true, false);
  }
};
