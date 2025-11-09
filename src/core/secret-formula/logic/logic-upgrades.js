import { DC } from "../../constants";

export const logicUpgrades = [
  {
    name: "Acceleration Infinity",
    id: 1,
    description: "Unlock a new Antimatter Dimension.",
    requirement: () => `Infinity in ${formatInt(1)} minute or less.`,
    checkRequirement: () => Time.thisInfinityRealTime.totalMinutes <= 1,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    hasFailed: () => Time.thisInfinityRealTime.totalMinutes > 1,
    cost: 3e17,
    effect: 1
  },
  {
    name: "Half life Three",
    id: 2,
    description: "Unlock a new Antimatter Dimension.",
    requirement: () => `Buy ${formatInt(12)} Infinity Upgrades.`,
    checkRequirement: () => player.infinityUpgrades.size >= 12,
    checkEvent: [
      GAME_EVENT.INFINITY_UPGRADE_BOUGHT,
      GAME_EVENT.REALITY_RESET_AFTER,
      GAME_EVENT.REALITY_UPGRADE_TEN_BOUGHT,
      GAME_EVENT.ETERNITY_RESET_AFTER,
      GAME_EVENT.APPLY_EL1_AFTER
    ],
    cost: 1e27,
    effect: 1
  },
  {
    name: "Four a minute",
    id: 3,
    description: "Unlock a new Antimatter Dimension.",
    requirement: () => `Reach ${formatPostBreak(DC.E1150)} antimatter in any challenge.`,
    checkRequirement: () => Player.isInAnyChallenge && Currency.antimatter.gte(DC.E1150),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    hasFailed: () => !Player.isInAnyChallenge,
    cost: 1e105,
    effect: 1
  },
  {
    name: "Pentagonal Dimension",
    id: 4,
    description: "Unlock a new Antimatter Dimension.",
    requirement: () => `Reach ${format(DC.E100)} Replicanti.`,
    checkRequirement: () => Replicanti.amount.gte(DC.E100),
    checkEvent: GAME_EVENT.REPLICANTI_TICK_AFTER,
    hasFailed: () => !player.break,
    effect: 1,
    cost: DC.E340
  },
  {
    name: "Could Afford Six",
    id: 5,
    description: "Unlock a new Antimatter Dimension.",
    requirement: () => `Enter Time Dilation.`,
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
    hasFailed: () => !TimeStudy.dilation.isBought && !TimeStudy.dilation.canBeBought,
    effect: 1
  },
  {
    name: "Lucky Upgrade",
    id: 6,
    description: "Unlock a new Antimatter Dimension.",
    requirement: () => `TBD`,
    checkRequirement: () => false,
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
    hasFailed: () => true,
    effect: 1
  },
  {
    name: "Not Over Yet",
    id: 7,
    description: "Unlock a new Antimatter Dimension.",
    requirement: () => `TBD`,
    checkRequirement: () => false,
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
    hasFailed: () => true,
    effect: 1
  },
  {
    name: "Bulk Boosts",
    id: 8,
    description: "You can buy five times as many Dimension Boosts at once.",
    requirement: () => `Infinity with less than ${formatInt(18)} Dimension Boosts with 2+ Dimensions unlocked.`,
    checkRequirement: () => DimBoost.purchasedBoosts < 18 && Puzzles.maxTier >= 2,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    hasFailed: () => DimBoost.purchasedBoosts >= 18 || Puzzles.maxTier < 2,
    cost: 1e21,
    effect: 5
  },
  {
    name: "Equivalent Exchange",
    id: 9,
    description: "Infinity no longer reset Exchange Resource.",
    requirement: () => `Infinity in ${formatInt(18)} seconds or less.`,
    checkRequirement: () => Time.thisInfinityRealTime.totalSeconds <= 18,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    hasFailed: () => Time.thisInfinityRealTime.totalSeconds > 18,
    cost: 6e21
  },
  {
    name: "Logic Challenges",
    id: 10,
    description: "Unlock Logic Challenges.",
    requirement: () => `Max the intervals for 3rd Antimatter Dimension Autobuyer.`,
    checkRequirement: () => {
      const autobuyer = Autobuyer.antimatterDimension(3);
      return autobuyer.isUnlocked && autobuyer.hasMaxedInterval;
    },
    checkEvent: [GAME_EVENT.ETERNITY_RESET_AFTER, GAME_EVENT.REALITY_RESET_AFTER, GAME_EVENT.REALITY_UPGRADE_TEN_BOUGHT],
    hasFailed: () => {
      const autobuyer = Autobuyer.antimatterDimension(3);
      return !autobuyer.isUnlocked || (Currency.infinityPoints.lt(autobuyer.cost) && !autobuyer.hasMaxedInterval);
    },
    cost: 9e28
  }
];