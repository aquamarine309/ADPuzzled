import { GameMechanicState } from "./game-mechanics/index.js";

class ExtraBonusState extends GameMechanicState {
  get isUnlocked() {
    return this.config.isUnlocked();
  }

  get isEffectActive() {
    return ExtraBonus.current.id === this.id &&
      ExtraBonus.isEffectActive &&
      !Pelle.isDoomed &&
      ExtraBonus.isUnlocked;
  }

  get description() {
    return this.config.description(this.effectValue);
  }
}

export const ExtraBonus = mapGameDataToObject(
  GameDatabase.logic.extraBonus,
  config => new ExtraBonusState(config)
);

Object.defineProperty(ExtraBonus, "current", {
  get() {
    if (Antiatom(1).milestones[1].isEffectActive) return ExtraBonus[player.switchBonus];
    return GameCache.currentBonus.value;
  }
});

Object.defineProperty(ExtraBonus, "isEffectActive", {
  get() { return player.extraBonusTimeLeft > 0; }
});

Object.defineProperty(ExtraBonus, "isUnlocked", {
  get() { return LogicChallenge(5).isCompleted || Antiatom(1).milestones[1].isEffectActive; }
});

Object.defineProperty(ExtraBonus, "tick", {
  // Real Diff
  value(diff) {
    if (player.extraBonusTimeLeft <= 0) return;
    player.extraBonusTimeLeft = Math.clampMin(player.extraBonusTimeLeft - diff, 0);
  }
});