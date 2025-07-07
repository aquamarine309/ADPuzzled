export const Puzzles = {
  get maxTier() {
    if (LogicChallenge(7).isRunning) return 1;
    if (!PlayerProgress.infinityUnlocked()) return 8;
    return GameCache.maxTier.value;
  },
  
  fakeAchievements: [23, 43],
  
  numberle: {
    get stage() {
      return player.numberle.stage;
    },

    get isCompleted() {
      return this.stage === GAME_STAGES.COMPLETED;
    },

    reset() {
      player.numberle.stage = GAME_STAGES.IN_PROGRESS;
      player.numberle.rows = null;
      player.numberle.currentRow = 0;
    }
  }
};