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
}

export const logicTree = {
  start: {
    id: 33,
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
  freeExchange: {
    id: 23,
    reqNodes: [33],
    name: "Rosebud",
    description: "Resource Exchange no longer spends your resources",
    requirement: "Eternity without exchanging resource",
    symbol: "<i class='fas fa-seedling'></i>",
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
    name: "One Forty Two",
    description: () => `Galaxies are ${formatPercents(0.042, 1)} stronger`,
    requirement: () => `Eternity with ${formatInt(142)} Antimatter Galaxies`,
    symbol: "<i class='fas fa-mountain'></i>",
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE,
    checkRequirement: () => player.galaxies >= 142,
    position: [1, 0],
    color: nodeColors.eternity,
    effect: 1.042
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
  }
};