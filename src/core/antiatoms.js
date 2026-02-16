import { GameMechanicState } from "./game-mechanics";
import { DC } from "./constants";

class AntiatomMilestoneState extends GameMechanicState {
  constructor(config, antiatom) {
    super(config);
    this.antiatom = antiatom;
  }
  
  get requirement() {
    return this.config.requirement;
  }
  
  get isReached() {
    return this.antiatom.level >= this.requirement;
  }
  
  get isEffectActive() {
    return this.isReached;
  }
}

class AntiatomState extends GameMechanicState {
  constructor(config) {
    const configCopy = { ...config };
    const effect = config.effect;
    configCopy.effect = () => effect(this.left, this.level, this.energy);
    configCopy.effectFn = (amount, level, energy) => effect(amount, level, energy);
    super(configCopy);
    this.milestones = mapGameData(
      config.milestones,
      milestone => new AntiatomMilestoneState(milestone, this)
    );
  }
  
  get symbol() {
    return this.config.symbol;
  }
  
  get data() {
    return player.logic.antiatoms[this.id - 1];
  }
  
  get amount() {
    return this.data.amount;
  }
  
  set amount(value) {
    this.data.amount = value;
  }
  
  get dimension() {
    return LogicDimension(this.id);
  }
  
  get spent() {
    return this.dimension.spent.value;
  }
  
  get left() {
    return this.amount - this.spent;
  }
  
  get level() {
    return this.data.level;
  }
  
  set level(value) {
    this.data.level = value;
  }
  
  get energy() {
    return this.data.energy;
  }
  
  set energy(value) {
    this.data.energy = value;
  }
  
  get requirement() {
    return this.config.requirement;
  }
  
  get isUnlocked() {
    if (this.id === 1) return true;
    return Antiatom(this.id - 1).milestones[3].isEffectActive;
  }
  
  get isEffectActive() {
    return this.isUnlocked;
  }
  
  get currency() {
    return this.config.currency();
  }
  
  get amountCost() {
    return this.config.amountCost(this.amount);
  }
  
  get amountAffordable() {
    return this.amountCost.lte(this.currency.value);
  }
  
  get levelCost() {
    return this.config.levelCost(this.level);
  }
  
  get levelAffordable() {
    return this.levelCost.lte(this.currency.value);
  }
  
  purchase() {
    if (!this.amountAffordable) return;
    this.currency.subtract(this.amountCost);
    this.amount++;
  }
  
  levelUp() {
    if (!this.levelAffordable) return;
    this.currency.subtract(this.levelCost);
    this.level++;
  }
  
  buyMax() {
    while (this.amountAffordable) {
      this.currency.subtract(this.amountCost);
      this.amount++;
    }
  }
  
  levelUpMax() {
    while (this.levelAffordable) {
      this.currency.subtract(this.levelCost);
      this.level++;
    }
  }
  
  get isEnergyUnlocked() {
    return this.milestones[2].isEffectActive;
  }
  
  get energyPerSecond() {
    if (!this.isEnergyUnlocked) return DC.D0;
    let gain = Decimal.pow(this.level, 2).add(1);
    if (ui.view.chargedAtom === this.id) {
      gain = gain.times(this.amount);
    };
    return gain;
  }
  
  get energyBoost() {
    if (!this.isEnergyUnlocked) return DC.D1;
    return Math.pow(this.energy.add(1).log10(), 2) / 3 + 1;
  }
  
  tick(diff) {
    if (!this.isEnergyUnlocked) return;
    this.energy = this.energy.add(this.energyPerSecond.times(diff / 1000));
  }
  
  get effectNoEnergy() {
    return this.config.effectFn(this.left, this.level, DC.D0);
  }
  
  reset() {
    this.amount = 0;
    this.level = 0;
    this.energy = DC.D0;
    this.dimension.amount = DC.D0;
    this.dimension.bought = 0;
    this.dimension.spent.invalidate();
  }
}

export const Antiatom = AntiatomState.createAccessor(
  GameDatabase.logic.antiatoms
);

export const Antiatoms = {
  all: Antiatom.index.compact(),
  
  get isUnlocked() {
    return InfinityChallenge(12).isCompleted;
  },
  
  tick(diff) {
    if (!Antiatoms.isUnlocked) return;
    for (const antiatom of Antiatoms.all) {
      antiatom.tick(diff);
    }
  },
  
  reset() {
    if (!Antiatoms.isUnlocked) return;
    for (const antiatom of Antiatoms.all) {
      antiatom.reset();
    }
    Currency.axioms.reset();
  }
}