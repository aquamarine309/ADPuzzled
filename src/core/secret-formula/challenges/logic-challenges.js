import { DC } from "../../constants.js";

export const logicChallenges = [
  {
    id: 1,
    description: () => `All Antimatter Dimensions produce less (${formatPow(0.4, 1, 1)}).
      The dimension multiplier uses effective dimension amount instead of dimension production, except for the highest dimension.
      The buy ten multiplier is reduced to ${formatX(0.2, 0, 1)}.`,
    goal: Decimal.NUMBER_MAX_VALUE,
    effect: 0.4,
    reward: {
      description: `Galaxies can automatically adjust the required dimensions`
    },
  },
  {
    id: 2,
    description: () => `Normal Challenges are broken. Dimension Boost multiplier is reduced to ${formatX(1)} and Galaxies are disabled.`,
    goal: DC.E1650,
    reward: {
      description: "Decrease the requirement of Galaxies, and unlock exchange rate"
    },
  },
  {
    id: 3,
    description: () => `The multiplier from Logic Points is reduced or raised based on the difference between Dimension Boosts and Galaxies.`,
    effect: () => Math.pow(Math.abs(player.galaxies - DimBoost.totalBoosts) + 1, -0.2) * 1.2,
    formatEffect: value => formatPow(value, 3, 3),
    goal: DC.E4000,
    reward: {
      description: "Unlock Replicanti"
    },
    isQuickResettable: true
  },
  {
    id: 4,
    description: "Infinity Power provides a multiplier to game speed instead of Antimatter Dimensions.",
    goal: DC.E10000,
    effect: () => Math.clamp(Math.pow(Currency.infinityPower.value.plus(1).log10(), InfinityDimensions.powerConversionRate), 1, 1e30),
    formatEffect: value => format(value, 3, 3),
    reward: {
      description: "Decrease the cost of Replicanti Upgrades based on current Infinity Points",
      effect: () => Math.pow(10, Math.sqrt(Currency.infinityPoints.value.plus(1).log10()) * 6),
      formatEffect: value => `/${format(value, 2, 3)}`
    }
  },
  {
    id: 5,
    description: `The Infinity Dimensions multiplier is based on Galaxies.
      Tickspeed cannot affect Antimatter Dimensions production.
      The multiplier from Logic Points and Exchange Level is disabled.
      The conversion rate of Infinity Power is decresed.`,
    goal: DC.E5000,
    effect: () => DC.D2.pow(Math.pow(1.03, effectiveBaseGalaxies())),
    formatEffect: value => formatX(value, 3, 3),
    reward: {
      description: "Unlock extra bonus (In Shop Tab)"
    }
  },
  {
    id: 6,
    description: "Decrease the cost and strength of Galaxies.",
    goal: DC.E20000,
    effect: 0.3,
    reward: {
      description: "Galaxies are stronger based on highest Antimatter Dimension",
      effect: () => Math.pow(2 - Puzzles.maxTier / 8, 0.25),
      formatEffect: value => `+${formatPercents(value - 1, 3, 3)}`
    }
  },
  {
    id: 7,
    description: () => `
      There is only the 1st Antimatter Dimension.
      Galaxies are ${formatPercents(0.5)} stronger.
      Achievement multiplier power +${format(1, 0, 1)}.
      Dimension boost multiplier ${formatPow(36)}.
      All dimension power +${format(0.028, 0, 3)}.
      Antimatter production: ${formatInt(10)}^x ➜ ${formatInt(10)}^(x^${format(1.026, 0, 4)}).
    `,
    goal: DC.E10000,
    effects: {
      galMul: 1.5,
      achPow: 2,
      dimBoostPow: 36,
      dimPow: 1.028,
      amPow: 1.026
    },
    reward: {
      description: "Unlock auto-replicate. Logic Points also affect Infinity Points gained",
      effect: () => ResourceExchangeUpgrade.effectOrDefault(DC.D1).pow(0.03),
      formatEffect: value => formatX(value, 2, 3)
    }
  },
  {
    id: 8,
    description: "When the number of Dimension Boosts is not a multiple of the number of Antimatter Galaxies, the production of Antimatter Dimensions will be reduced.",
    effect: 0.5,
    formatEffect: value => formatPow(value, 1, 1),
    effectCondition: () => !Number.isInteger(
      DimBoost.totalBoosts /
      Math.max(1, player.galaxies)
    ),
    goal: DC.E32000,
    reward: {
      description: `Dimensional Sacrifice can automatically adjust the required dimensions`
    }
  }
];