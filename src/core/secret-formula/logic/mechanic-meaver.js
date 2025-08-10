export const mechanicMeaver = {
  mechanics: {
    allowNC: {
      id: "allowNC",
      cost: 1,
      code: state => `
// On starting a challenge
if (${state ? "!" : ""}PlayerProgress.eternityUnlocked()) {
  Modal.message.show(\"The Challenge is disabled.\");
  return;
}`,
      type: MEAVER_TYPE.BOOLEAN,
      default: false,
      name: "Normal Challenge Control",
      description: "Unlock post-Eternity access to Normal Challenges. Toggle the button below to enable it.",
      file: "normal-challenges.js",
      formatEffect: state => state ? "Can Start Challenge" : "Cannot Start Challenge",
      onSaving() {
        const currentNC = NormalChallenge.current;
        if (currentNC !== undefined) {
          currentNC.exit();
        }
      }
    },
    noNumberle: {
      id: "noNumberle",
      cost: 1,
      code: state => {
        const innerBlock = state ? 
  `player.hasDLC = true;` :
  `Puzzles.numberle.reset();
  Modal.numberle.show();`;
        return `
// When toggle DLC state
if (!player.hasDLC) {
  ${innerBlock}
  return;
}
player.hasDLC = false;
eternity(true, false);`;
      },
      type: MEAVER_TYPE.BOOLEAN,
      default: false,
      name: "Numberle For DLC",
      description: "Numberle: fun until it starts feeling like math homework. Flip this switch to yeet it into the void!",
      file: "OptionsGameplayTab.vue",
      formatEffect: state => state ? "DLC without Numberle" : "DLC with Numberle"
    },
    startingExtra: {
      id: "startingExtra",
      cost: 2,
      code: state => `
Object.defineProperty(ExtraBonus, "isUnlocked", {
  get() { return ${state ? "true" : "LogicChallenge(5).isCompleted"}; }
});`,
      type: MEAVER_TYPE.BOOLEAN,
      default: false,
      name: "Extra Bonus Condition",
      description: "Unlocking the Extra Bonus used to require completing LC5 - seriously, who designed that? Now you get this sweet upgrade without jumping through Logic Challenge hoops!",
      file: "extra-bonus.js",
      formatEffect: state => state ? "Start With Extra Bonus" : "Completing LC5 Only",
      onSaving() {
        if (player.extraBonusTimeLeft > 0) {
            player.extraBonusTimeLeft = 0;
        }
      }
    },
    keepExtra: {
      id: "keepExtra",
      cost: [0, 1, 2, 3, 4, 6],
      effectFn: index => index * 3,
      labels: ["Default", "+3h", "+6h", "+9h", "+12h", "Permanent"],
      code: value => {
        const block = value < 15 ?
`if (this.hasBonus || this.isDoomed) return false;
  player.extraBonusTimeLeft += 3.6e6 * ${5 + value};
  GameUI.update();` :
`// The Extra Bonus is permanent`;
        return `getBonus() {
  ${block}
}`;
      },
      type: MEAVER_TYPE.ENUM,
      default: 0,
      name: "Extra Bonus Duration",
      description: "Is the next update in 5 hours? No, It may be more longer.",
      file: "extra-bonus.js",
      formatEffect: value => (value < 15 ? `+${formatInt(value)} Hours Duration` : "Always Effective"),
      onSaving(value) {
        if (player.extraBonusTimeLeft > value + 5) {
            player.extraBonusTimeLeft = value;
        }
      }
    },
    startingDim: {
      id: "startingDim",
      cost: [0, 1, 3, 6],
      effectFn: index => index + 1,
      labels: ["1st Dim", "2nd Dim", "3rd Dim", "4th Dim"],
      code: value => `
get maxTier() {
  return ${value};
}`,
      type: MEAVER_TYPE.ENUM,
      default: 0,
      name: "Starting With Dimensions",
      description: "Starting with some available Dimensions can avoid many unnecessary troubles. (Note: Some Logic Upgrades will not work)",
      file: "antimatter-dimensions.js",
      formatEffect: value => `Starting with ${AntimatterDimension(value).shortDisplayName} Dimension`,
      onSaving() {
        GameCache.maxTier.invalidate();
      }
    }
  }
};