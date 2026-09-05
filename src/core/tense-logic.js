import { GameMechanicState } from "./game-mechanics";
import { deepmergeAll } from "../utility/deepmerge";
import { DC } from "./constants";

export const TenseLogic = {
  get isUnlocked() {
    return player.records.bestEternity.time < 1.8e6;
  },
  
  get score() {
    return Math.floor(
      this.scoreFromIP
      * this.scoreFromTime
      * this.scoreFromTier
      * Effects.product(
        TenseBoost.tenseBoost,
        LogicNode.start
      )
    );
  },
  
  get scoreFromIP() {
    return Currency.infinityPoints.value.add(1).log10() * 0.1;
  },
  
  get scoreFromTime() {
    const maxTime = Effects.min(
      Infinity,
      LogicNode.maxTime1
    );
    return 3e3 / Math.sqrt(Math.clamp(player.records.thisEternity.time, 3e3, maxTime) || 1);
  },
  
  get scoreFromTier() {
    return Math.pow(10, Math.pow(1.5, 5 - GameCache.maxTier.value) - 1);
  },
  
  totalWeight: new Lazy(() => player.tense.boostWeights.sum())
};

class TenseBoostState extends GameMechanicState {
  constructor(config) {
    const effect = config.effect;
    const configCopy = deepmergeAll([{}, config]);
    configCopy.effect = () => effect(this.score);
    configCopy.effectAt = effect;
    super(configCopy);
  }
  
  get weight() {
    return player.tense.boostWeights[this.id];
  }
  
  set weight(value) {
    player.tense.boostWeights[this.id] = Math.clampMin(value, 0);
    TenseLogic.totalWeight.invalidate();
  }
  
  scoreAt(totalScore) {
    if (this.weight === 0) return 0;
    const total = TenseLogic.totalWeight.value;
    if (total === 0) return 0;
    return this.weight * totalScore / total;
  }
  
  get score() {
    return this.scoreAt(player.tense.pastScore);
  }
}

export const TenseBoost = mapGameDataToObject(
  GameDatabase.logic.tenseBoosts,
  config => new TenseBoostState(config)
);