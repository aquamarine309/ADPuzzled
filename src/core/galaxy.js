export const GALAXY_TYPE = {
  NORMAL: 0,
  DISTANT: 1,
  REMOTE: 2
};

class GalaxyRequirement {
  constructor(tier, amount) {
    this.tier = tier;
    this.amount = amount;
  }

  get isSatisfied() {
    const dimension = AntimatterDimension(this.tier);
    return dimension.totalAmount.gte(this.amount);
  }
}

export class Galaxy {
  static get isUnlocked() {
    return NormalChallenge(11).isCompleted;
  }

  static get remoteStart() {
    return RealityUpgrade(21).effectOrDefault(800);
  }

  static get requirement() {
    return this.requirementAt(player.galaxies);
  }

  /**
   * Figure out what galaxy number we can buy up to
   * @param {number} currency Either dim 8 or dim 6, depends on current challenge
   * @returns {number} Max number of galaxies (total)
   */
  static buyableGalaxies(currency) {
    const bulk = bulkBuyBinarySearch(new Decimal(currency), {
      costFunction: x => this.requirementAt(x).amount,
      cumulative: false,
    }, player.galaxies);
    if (!bulk) throw new Error("Unexpected failure to calculate galaxy purchase");
    return player.galaxies + bulk.quantity;
  }

  static requirementAt(galaxies) {
    let amount = Galaxy.baseCost + (galaxies * Galaxy.costMult);

    const type = Galaxy.typeAt(galaxies);

    if (type === GALAXY_TYPE.DISTANT && EternityChallenge(5).isRunning) {
      amount += Math.pow(galaxies, 2) + galaxies;
    } else if (type === GALAXY_TYPE.DISTANT || type === GALAXY_TYPE.REMOTE) {
      const galaxyCostScalingStart = this.costScalingStart;
      const galaxiesBeforeDistant = Math.clampMin(galaxies - galaxyCostScalingStart + 1, 0);
      amount += Math.pow(galaxiesBeforeDistant, 2) + galaxiesBeforeDistant;
    }

    if (type === GALAXY_TYPE.REMOTE) {
      amount *= Math.pow(1.002, galaxies - (Galaxy.remoteStart - 1));
    }

    amount -= Effects.sum(InfinityUpgrade.resetBoost);
    if (InfinityChallenge(5).isCompleted) amount -= 1;

    if (GlyphAlteration.isAdded("power")) amount *= getSecondaryGlyphEffect("powerpow");

    amount = Math.floor(amount);
    const tier = Galaxy.requiredTier;
    return new GalaxyRequirement(tier, amount);
  }

  static get costMult() {
    const mult = Effects.min(NormalChallenge(10).isRunning ? 90 : 60, TimeStudy(42));
    if (PlayerProgress.infinityUnlocked() && !LogicChallenge(2).isCompleted) {
      return mult * 2.5;
    }
    return mult;
  }

  static get baseCost() {
    return NormalChallenge(10).isRunning ? 99 : 80;
  }

  static get requiredTier() {
    const tier = NormalChallenge(10).isRunning ? 6 : 8;
    if (LogicChallenge(1).isCompleted) {
      return Math.clampMax(Puzzles.maxTier, tier);
    }
    return tier;
  }

  static get canBeBought() {
    if (LogicChallenge(2).isRunning) return false;
    if (EternityChallenge(6).isRunning && !Enslaved.isRunning) return false;
    if (NormalChallenge(8).isRunning || InfinityChallenge(7).isRunning) return false;
    if (player.records.thisInfinity.maxAM.gt(Player.infinityGoal) &&
       (!player.break || Player.isInAntimatterChallenge)) return false;
    return true;
  }

  static get lockText() {
    if (this.canBeBought) return null;
    if (LogicChallenge(2).isRunning) return "Locked (Logic Challenge 2)";
    if (EternityChallenge(6).isRunning) return "Locked (Eternity Challenge 6)";
    if (InfinityChallenge(7).isRunning) return "Locked (Infinity Challenge 7)";
    if (InfinityChallenge(1).isRunning) return "Locked (Infinity Challenge 1)";
    if (NormalChallenge(8).isRunning) return "Locked (8th Antimatter Dimension Autobuyer Challenge)";
    return null;
  }

  static get costScalingStart() {
    return 100 + TimeStudy(302).effectOrDefault(0) + Effects.sum(
      TimeStudy(223),
      TimeStudy(224),
      EternityChallenge(5).reward,
      GlyphSacrifice.power
    );
  }

  static get type() {
    return this.typeAt(player.galaxies);
  }

  static typeAt(galaxies) {
    if (galaxies >= Galaxy.remoteStart) {
      return GALAXY_TYPE.REMOTE;
    }
    if (EternityChallenge(5).isRunning || galaxies >= this.costScalingStart) {
      return GALAXY_TYPE.DISTANT;
    }
    return GALAXY_TYPE.NORMAL;
  }
}

function galaxyReset() {
  EventHub.dispatch(GAME_EVENT.GALAXY_RESET_BEFORE);
  player.galaxies++;
  if (!Achievement(143).isUnlocked || (Pelle.isDoomed && !PelleUpgrade.galaxyNoResetDimboost.canBeApplied)) {
    player.dimensionBoosts = 0;
  }
  softReset(0);
  if (Notations.current === Notation.emoji) player.requirementChecks.permanent.emojiGalaxies++;
  // This is specifically reset here because the check is actually per-galaxy and not per-infinity
  player.requirementChecks.infinity.noSacrifice = true;
  EventHub.dispatch(GAME_EVENT.GALAXY_RESET_AFTER);
}

// This is used to purchase first two galaxies before Big Crunch
export function forceGalaxyReset() {
  manualRequestGalaxyReset(false, true);
}

export function manualRequestGalaxyReset(bulk, force = false) {
  if (!Galaxy.canBeBought || !Galaxy.requirement.isSatisfied || !Galaxy.isUnlocked && !force) return;
  if (GameEnd.creditsEverClosed) return;
  if (RealityUpgrade(7).isLockingMechanics && player.galaxies > 0) {
    RealityUpgrade(7).tryShowWarningModal();
    return;
  }
  if (player.options.confirmations.antimatterGalaxy) {
    Modal.antimatterGalaxy.show({ bulk: bulk && EternityMilestone.autobuyMaxGalaxies.isReached });
    return;
  }
  requestGalaxyReset(bulk);
}

// All galaxy reset requests, both automatic and manual, eventually go through this function; therefore it suffices
// to restrict galaxy count for RUPG7's requirement here and nowhere else
export function requestGalaxyReset(bulk, limit = Number.MAX_VALUE) {
  const restrictedLimit = RealityUpgrade(7).isLockingMechanics ? 1 : limit;
  if (EternityMilestone.autobuyMaxGalaxies.isReached && bulk) return maxBuyGalaxies(restrictedLimit);
  if (player.galaxies >= restrictedLimit || !Galaxy.canBeBought || !Galaxy.requirement.isSatisfied) return false;
  Tutorial.turnOffEffect(TUTORIAL_STATE.GALAXY);
  galaxyReset();
  return true;
}

function maxBuyGalaxies(limit = Number.MAX_VALUE) {
  if (player.galaxies >= limit || !Galaxy.canBeBought) return false;
  // Check for ability to buy one galaxy (which is pretty efficient)
  const req = Galaxy.requirement;
  if (!req.isSatisfied) return false;
  const dim = AntimatterDimension(req.tier);
  const newGalaxies = Math.clampMax(
    Galaxy.buyableGalaxies(Math.round(dim.totalAmount.toNumber())),
    limit);
  if (Notations.current === Notation.emoji) {
    player.requirementChecks.permanent.emojiGalaxies += newGalaxies - player.galaxies;
  }
  // Galaxy count is incremented by galaxyReset(), so add one less than we should:
  player.galaxies = newGalaxies - 1;
  galaxyReset();
  if (Enslaved.isRunning && player.galaxies > 1) EnslavedProgress.c10.giveProgress();
  Tutorial.turnOffEffect(TUTORIAL_STATE.GALAXY);
  return true;
}
