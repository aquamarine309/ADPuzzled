import { DimensionState } from "./dimension";
import { DC } from "../constants";

class LogicDimensionState extends DimensionState {
  constructor(tier) {
    super(() => player.dimensions.logic, tier);
    const COST_COL = [1, 2, 3, 5, 8, 10, 15, 20][this.tier - 1];
    this.costCol = COST_COL;
  }
  
  get cost() {
    const c = this.costCol;
    const x = this.bought;
    return c * x + 1;
  }
  
  get antiatom() {
    return Antiatom(this.tier);
  }
  
  get bulk() {
    const p = this.antiatom.amount;
    if (currency < 1) return 0;
    const q = this.costCol;
    return Math.floor((Math.sqrt((q + 2) ** 2 + 8 * p * q) - q - 2) / (2 * q));
  }
  
  get multiplier() {
    return DC.D1;
  }
  
  get rateOfChange() {
    return DC.D0;
  }
  
  get isUnlocked() {
    return this.antiatom.level >= 1;
  }
}

export const LogicDimension = LogicDimensionState.createAccessor();

export const LogicDimensions = {
  all: LogicDimension.index.compact()
};