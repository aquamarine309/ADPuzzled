import {
  DC
} from "../../constants.js";

const nodeColors = {
  normal: {
    baseColor: "var(--color-tense)",
    bgColor: "#a76598"
  },
  logic: {
    baseColor: "var(--color-logic)",
    bgColor: "#7ce4ab"
  },
  eternity: {
    baseColor: "var(--color-eternity)",
    bgColor: "#c896d9"
  },
  dilation: {
    baseColor: "var(--color-dilation)",
    bgColor: "#a0ee65"
  }
}

export const logicTree = {
  start: {
    id: 33,
    reqNodes: [],
    name: "Good Luck",
    description: "Double score gain",
    requirement: () => `Eternity with a score of at least ${formatInt(2000)}`,
    symbol: "<i class='fas fa-flag'></i>",
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE,
    checkRequirement: () => TenseLogic.score >= 2000,
    position: [0, 0],
    color: nodeColors.normal,
    effect: 2
  },
  maxTime1: {
    id: 32,
    reqNodes: [33],
    name: "Sub-Minute Sprint",
    description: () => `The time in the score formula has a cap of ${formatInt(7)} minutes`,
    requirement: () => `Eternity with a score of less than ${formatInt(777)} in ${formatInt(1)} minute`,
    symbol: "<i class='fas fa-stopwatch'></i>1",
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE,
    checkRequirement: () => TenseLogic.score < 777 && player.records.bestEternity.time < 60e3,
    position: [0, -1],
    color: nodeColors.normal,
    effect: 7 * 60e3
  },
  eternityScore: {
    id: 41,
    reNodes: [32],
    name: "Yo dawg, I heard you like scores.",
    description: "Unlock score-based reset option in Eternity Autobuyer",
    requirement: () => `Have all your Eternities in your past ${formatInt(10)} Eternities be at least ${formatInt(1000)} higher score than the previous one`,
    symbol: "<i class='fas fa-chart-line'></i>",
    checkEvent: GAME_EVENT.ETERNITY_RESET_AFTER,
    checkRequirement: () => {
      if (player.records.recentEternities.some(i => i[0] === Number.MAX_VALUE)) return false;
      const scores = player.records.recentEternities.map(run => run[6]);
      for (let i = 0; i < scores.length - 1; i++) {
        if (scores[i] < scores[i + 1] + 1000) return false;
      }
      return true;
    },
    position: [1, -2],
    color: nodeColors.normal
  },
  freeExchange: {
    id: 23,
    reqNodes: [33],
    name: "The First One Is Free",
    description: "Resource Exchange no longer spends your resources",
    requirement: "Eternity without exchanging resource",
    symbol: "<i class='fas fa-coins'></i> <i class='fas fa-ban'></i>",
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE,
    checkRequirement: () => player.requirementChecks.eternity.noExchange,
    position: [-1, 0],
    color: nodeColors.logic
  },
  logicUpgradeAutobuyer: {
    id: 12,
    reqNodes: [32],
    name: "The Loneliest Number",
    description: "Eternity no longer reset the unlocked Logic Upgrades. Unlock Logic Upgrade autobuyer",
    requirement: () => `Reach ${format(DC.E180000)} antimatter with ${formatInt(1)} total Logic Point`,
    symbol: "<i class='fas fa-gears'></i>",
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    checkRequirement: () => Currency.antimatter.gte(DC.E180000) && GameCache.logicPoints.value.eq(1),
    position: [-2, -1],
    color: nodeColors.logic
  },
  galaxyMult: {
    id: 43,
    reqNodes: [33],
    name: "One Forty Seven",
    description: () => `Galaxies are ${formatPercents(0.047, 1)} stronger`,
    requirement: () => `Eternity with ${formatInt(147)} Antimatter Galaxies`,
    symbol: "<i class='fas fa-mountain'></i>",
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE,
    checkRequirement: () => player.galaxies >= 147,
    position: [1, 0],
    color: nodeColors.eternity,
    effect: 1.047
  },
  ts73Pow: {
    id: 52,
    reqNodes: [43],
    name: "The Hermit",
    description: () => `TS 73 is raised to ${format(3.65, 0, 2)}th power`,
    requirement: () => `Reach ${format(DC.E365)} Infinity Points without entering the Logic tab or using X hotkey`,
    symbol: "<i class='fas fa-tree'></i>",
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    checkRequirement: () => player.requirementChecks.eternity.noLogicTab && Currency.infinityPoints.gte(DC.E365),
    position: [2, -1],
    color: nodeColors.eternity,
    effect: 3.65
  },
  onlineEM6: {
    id: 54,
    reqNodes: [43],
    name: "First Sacrifice?",
    description: "Eternity Milestone 6 can work online",
    requirement: () => `Reach ${format(DC.E150000)} antimatter with ${formatX(1)} scarifice miltiplier and ${formatInt(2)} galaxies this infinity`,
    symbol: "<i class='fas fa-skull'></i>",
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    checkRequirement: () => (
      Currency.antimatter.gte(DC.E150000) &&
      player.requirementChecks.infinity.noSacrifice &&
      player.galaxies + Replicanti.galaxies.total === 2
    ),
    position: [2, 1],
    color: nodeColors.eternity,
    effect: () => player.records.bestEternity.bestEPminReality.times(0.001),
    formatEffect: value => `${format(value, 2, 2)} EP/min`
  },
  unlockDilation: {
    id: 34,
    reqNodes: [33],
    name: "Temporal Paradox",
    description: "Unlock Dilation",
    requirement: () => `Buy ${formatInt(12900)} 1st Dimensions.`,
    symbol: "Ψ",
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    checkRequirement: () => AntimatterDimension(1).bought >= 12900,
    position: [0, 1],
    color: nodeColors.dilation,
  },
  extraDimension: {
    id: 25,
    reqNodes: [34],
    name: "My Timewalls Will Make You Suffer",
    description: "Unlock an extra Antimatter Dimension while Dilation (Hardcap at 9th Dimension)",
    requirement: "Complete your first Dilation",
    symbol: "α",
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    checkRequirement: () => false,
    position: [-1, 2],
    color: nodeColors.dilation
  }
};