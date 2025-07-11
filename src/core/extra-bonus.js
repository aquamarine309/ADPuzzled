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

Object.defineProperty(ExtraBonus, "isUnlocked", {
  get() { return LogicChallenge(5).isCompleted || MechanicMeaver.mechanics.startingExtra.value; }
});

Object.defineProperty(ExtraBonus, "isPermanent", {
  get() { return MechanicMeaver.mechanics.keepExtra.value >= 5; }
});

Object.defineProperty(ExtraBonus, "current", {
  get() { return GameCache.currentBonus.value; }
});

Object.defineProperty(ExtraBonus, "isEffectActive", {
  get() { return this.isPermanent || player.extraBonusTimeLeft > 0; }
});

Object.defineProperty(ExtraBonus, "tick", {
  // Real Diff
  value(diff) {
    if (player.extraBonusTimeLeft <= 0 || this.isPermanent) return;
    player.extraBonusTimeLeft = Math.clampMin(player.extraBonusTimeLeft - diff, 0);
  }
});