import { MultiplierTabIcons } from "./icons";

// See index.js for documentation
export const score = {
  total: {
    name: "Next Tense Score",
    isBase: true,
    multValue: () => TenseLogic.score,
    isActive: () => TenseLogic.isUnlocked,
    overlay: ["<i class='fa-solid fa-hourglass-half' />"],
  },
  infinityPoint: {
    name: "Score From Infinity Points",
    multValue: () => TenseLogic.scoreFromIP,
    isActive: () => gainedInfinityPoints().gt(0),
    icon: MultiplierTabIcons.CONVERT_FROM("IP"),
  },
  time: {
    name: "Score based on Time spent",
    multValue: () => TenseLogic.scoreFromTime,
    isActive: () => true,
    icon: MultiplierTabIcons.GAMESPEED
  },
  highestDim: {
    name: "Score based on the highest Dimension",
    multValue: () => TenseLogic.scoreFromTier,
    isActive: () => true,
    icon: () => MultiplierTabIcons.DIMENSION("AD", Puzzles.maxTier)
  },
  tense: {
    name: "Tense Boost Multiplier",
    multValue: () => TenseBoost.tenseBoost.effectValue,
    isActive: () => TenseBoost.tenseBoost.score > 0,
    icon: MultiplierTabIcons.TENSE
  },
  logicAch: {
    name: "Logic Achievement - Good Luck",
    multValue: () => LogicNode.start.effectValue,
    isActive: () => LogicNode.start.isUnlocked,
    icon: MultiplierTabIcons.LOGIC_ACHIEVEMENT
  }
};
