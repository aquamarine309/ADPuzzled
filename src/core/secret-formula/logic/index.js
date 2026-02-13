import { resourceExchange } from "./resource-exchange";
import { logicUpgrades } from "./logic-upgrades";
import { extraBonus } from "./extra-bonus";
import { antiatoms } from "./antiatoms";

export const logic = {
  extraBonus,
  resourceExchange,
  upgrades: logicUpgrades,
  antiatoms
};