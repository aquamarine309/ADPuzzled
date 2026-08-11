import { DC } from "../../constants.js";

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
    id: 23,
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
    id: 32,
    req: [33],
    name: "Rosebud",
    description: "Resource Exchange no longer spends your resources",
    requirement: "Eternity without exchanging resource",
    symbol: "<i class='fas fa-seedling'></i>",
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE,
    checkRequirement: () => player.requirementChecks.eternity.noExchange,
    position: [-1, 0],
    color: nodeColors.logic
  },
  galaxyMult: {
    id: 34,
    reqNode: [33],
    name: "One Forty Two",
    description: () => `Galaxies are ${formatPercents(0.042, 1)} stronger`,
    requirement: () => `Eternity with ${formatInt(142)} Antimatter Galaxies`,
    symbol: "<i class='fas fa-mountain'></i>",
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE,
    checkRequirement: () => player.galaxies >= 142,
    position: [1, 0],
    color: nodeColors.eternity,
    effect: 1.042
  }
}