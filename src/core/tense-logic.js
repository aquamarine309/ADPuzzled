import { GameMechanicState } from "./game-mechanics";
import { deepmergeAll } from "../utility/deepmerge";
import { DC } from "./constants";

export const TenseLogic = {
  get isUnlocked() {
    return player.records.bestEternity.time < 6e4;
  },
  
  get score() {
    const maxTime = Effects.min(
      Infinity,
      LogicNode.maxTime1
    );
    return Math.floor(
      Currency.infinityPoints.value.add(1).log10() * 0.1
      * 3e3 / Math.sqrt(Math.min(player.records.thisEternity.time, maxTime) || 1)
      * Math.pow(10, Math.pow(1.5, 5 - GameCache.maxTier.value) - 1)
      * Effects.product(
        TenseBoost.tenseBoost,
        LogicNode.start
      )
    );
  },
  
  totalWeight: new Lazy(() => player.tense.boostWeights.sum()),
  
  get achevementRequirement() {
    return DC.E3000;
  }
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
    GameCache.logicPoints.invalidate();
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