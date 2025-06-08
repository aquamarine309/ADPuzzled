export const Puzzles = {
  get maxTier() {
    if (LogicChallenge(7).isRunning) return 1;
    return GameCache.maxTier.value;
  }
};