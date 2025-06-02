import { GameMechanicState, RebuyableMechanicState } from "./game-mechanics/index.js";

class LogicChallengeRewardState extends GameMechanicState {
  constructor(config, challenge) {
    super(config);
    this._challenge = challenge;
  }

  get isEffectActive() {
    return this._challenge.isCompleted;
  }
}

class LogicChallengeState extends GameMechanicState {
  constructor(config) {
    super(config);
    this._reward = new LogicChallengeRewardState(config.reward, this);
  }

  get isUnlocked() {
    if (this.id === 1) return LogicUpgrade(10).isBought;
    return LogicChallenge(this.id - 1).isCompleted;
  }

  get isRunning() {
    return player.challenge.logic.current === this.id;
  }

  requestStart() {
    if (!this.isUnlocked) return;
    if (GameEnd.creditsEverClosed) return;
    this.start();
  }

  start() {
    if (!this.isUnlocked || this.isRunning) return;
    // Forces big crunch reset but ensures IP gain, if any.
    bigCrunchReset(true, true);
    player.challenge.logic.current = this.id;
    if (!Enslaved.isRunning) Tab.dimensions.antimatter.show();
  }

  get isCompleted() {
    return (player.challenge.logic.completedBits & (1 << this.id)) !== 0;
  }

  complete() {
    player.challenge.logic.completedBits |= 1 << this.id;
    EventHub.dispatch(GAME_EVENT.LOGIC_CHALLENGE_COMPLETED, this.id);
    LogicChallenges._completions.invalidate();
  }

  get isEffectActive() {
    return this.isRunning;
  }

  get canBeCompleted() {
    return player.records.thisInfinity.maxAM.gte(this.goal) && Player.canCrunch;
  }

  /**
   * @return {LogicChallengeRewardState}
   */
  get reward() {
    return this._reward;
  }

  get isQuickResettable() {
    return this.config.isQuickResettable ?? false;
  }

  get goal() {
    return this.config.goal;
  }

  exit() {
    player.challenge.logic.current = 0;
    bigCrunchReset(true, false);
    if (!Enslaved.isRunning) Tab.dimensions.antimatter.show();
  }
}

/**
 * @param {number} id
 * @return {LogicChallengeState}
 */
export const LogicChallenge = LogicChallengeState.createAccessor(GameDatabase.challenges.logic);

/**
 * @returns {LogicChallengeState}
 */
Object.defineProperty(LogicChallenge, "current", {
  get: () => (player.challenge.logic.current > 0
    ? LogicChallenge(player.challenge.logic.current)
    : undefined),
});

Object.defineProperty(LogicChallenge, "isRunning", {
  get: () => LogicChallenge.current !== undefined,
});

export const LogicChallenges = {
  /**
   * @type {LogicChallengeState[]}
   */
  all: LogicChallenge.index.compact(),
  completeAll() {
    for (const challenge of LogicChallenges.all) challenge.complete();
  },
  clearCompletions() {
    player.challenge.logic.completedBits = 0;
    LogicChallenges._completions.invalidate();
  },
  /**
   * @returns {LogicChallengeState[]}
   */
  get completed() {
    return LogicChallenges.all.filter(lc => lc.isCompleted);
  },

  _completions: new Lazy(() => LogicChallenges.all.countWhere(challenge => challenge.isCompleted)),

  get completions() {
    return this._completions.value;
  }
};