export const TenseLogic = {
  get isUnlocked() {
    return player.records.bestEternity.time < 6e4;
  },
  
  get score() {
    return Math.floor((Currency.infinityPoints.value.add(1).log10() * 0.1
    + 6e5 / (player.records.thisEternity.time || 1))
    * Math.pow(10, Math.pow(2, 5 - GameCache.maxTier.value) - 1));
  }
};