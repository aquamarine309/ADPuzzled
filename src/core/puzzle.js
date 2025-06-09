export const Puzzles = {
  get maxTier() {
    if (LogicChallenge(7).isRunning) return 1;
    if (!PlayerProgress.infinityUnlocked()) return 8;
    return GameCache.maxTier.value;
  },
  
  fakeAchievements: [23, 43]
};