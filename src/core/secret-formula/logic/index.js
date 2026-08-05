import { resourceExchange } from "./resource-exchange";
import { logicUpgrades } from "./logic-upgrades";
import { extraBonus } from "./extra-bonus";
import { tenseBoosts } from "./tense-boosts";

export const logic = {
  extraBonus,
  resourceExchange,
  upgrades: logicUpgrades,
  tenseBoosts
};