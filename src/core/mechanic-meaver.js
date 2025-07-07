import { GameMechanicState } from "./game-mechanics";

class MechanicMeaverState extends GameMechanicState {
  constructor(config, key) {
    super(config);
    this.key = key;
  }

  get type() {
    return this.config.type;
  }
  
  get data() {
    return player.logic.meaver[this.key][this.id];
  }
  
  get value() {
    return this.data.value;
  }
  
  set value(value) {
    this.data.value = value;
  }
  
  get valueToModify() {
    return this.data.valueToModify;
  }
  
  set valueToModify(value) {
    this.data.valueToModify = value;
  }

  costAt(value) {
    const cost = this.config.cost;
    switch (this.type) {
      case Boolean:
        // Not a rebuyable
        return cost;
      case Number:
      case Decimal:
        return cost(value, this.value)
      default:
        throw new Error("Unknown type of Mechanic Meaver item.");
    }
  }
  
  get cost() {
    return this.costAt(this.valueToModify);
  }
  
  get isAffordable() {
    return Currency.logicFragments.gte(this.cost);
  }
  
  modify() {
    if (!this.isAffordable) return;
    Currency.logicFragments.subtract(this.cost);
    this.value = this.valueToModify;
  }
}

function mapFn(key) {
  return mapGameDataToObject(
    database[key], config => new MechanicMeaverState(config, key)
  );
}

const database = GameDatabase.logic.mechanicMeaver;

export const MechanicMeaver = {
  mechanics: mapFn("mechanics"),
  
  debugConsole: [],
  
  logInfoToConsole(message) {
    this.debugConsole.push(message);
  }
}