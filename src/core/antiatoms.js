import { GameMechanicState } from "./game-mechanics";

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
    configCopy.effect = () => effect(this.amount, this.level);
    super(configCopy);
    this.milestones = mapGameData(
      config.milestones,
      milestone => new AntiatomMilestoneState(milestone, this)
    );
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
  
  get level() {
    return this.data.level;
  }
  
  set level(value) {
    this.data.level = value;
  }
  
  get requirement() {
    return this.config.requirement;
  }
  
  get isUnlocked() {
    if (this.id === 1) return true;
    return Antiatom(this.id - 1).amount >= this.requirement;
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
}

export const Antiatom = AntiatomState.createAccessor(
  GameDatabase.logic.antiatoms
);

export const Antiatoms = {
  all: Antiatom.index.compact(),
  
  get isUnlocked() {
    return InfinityChallenge(12).isUnlocked;
  }
}