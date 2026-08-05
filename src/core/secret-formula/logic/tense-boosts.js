export const tenseBoosts = {
  adBoost: {
    description: "Antimatter Dimension multiplier.",
    effect: score => Decimal.pow(score, 100).add(1),
    formatEffect: value => formatX(value, 2, 2)
  }
};