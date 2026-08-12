export const tenseBoosts = {
  antimatterBoost: {
    id: 0,
    symbol: "Ω",
    color: "var(--color-antimatter)",
    description: "Antimatter Dimension multiplier.",
    effect: score => Decimal.pow(score, 120).add(1),
    formatEffect: value => formatX(value, 2, 2)
  },
  infinityBoost: {
    id: 1,
    symbol: "∞",
    color: "var(--color-infinity)",
    description: "Infinity Point and Infinity Dimension multiplier.",
    effect: score => Decimal.pow(score, 3).add(1),
    formatEffect: value => formatX(value, 2, 2)
  },
  eternityBoost: {
    id: 2,
    symbol: "Δ",
    color: "var(--color-eternity)",
    description: "Eternity Point and Time Dimension multiplier.",
    effect: score => Decimal.cbrt(score).times(0.2).add(1),
    formatEffect: value => formatX(value, 2, 2)
  },
  challengeBoost: {
    id: 3,
    symbol: "π",
    color: "var(--color-accent)",
    description: "Matter growth rate.",
    effect: score => Decimal.pow10(Math.sqrt(score) * 5),
    formatEffect: value => `${formatX(value.pow(20))}/sec`
  },
  logicBoost: {
    id: 4,
    symbol: "<i class='fas fa-exchange'></i>",
    color: "var(--color-logic)",
    description: "Logic Point multiplier.",
    effect: score => Decimal.pow(score, 30).add(1),
    formatEffect: value => formatX(value, 2, 2)
  },
  tenseBoost: {
    id: 5,
    symbol: "<i class='fas fa-hourglass-half'></i>",
    color: "var(--color-tense)",
    description: "Tense Score multiplier.",
    effect: score => Math.sqrt(score) * 0.02 + 1,
    formatEffect: value => formatX(value, 2, 3)
  }
};