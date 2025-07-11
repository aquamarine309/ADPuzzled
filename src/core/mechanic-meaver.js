import { GameMechanicState } from "./game-mechanics";

class MechanicMeaverState extends GameMechanicState {
  constructor(config, key) {
    if (config.effectFn) {
      config.effect = () => config.effectFn(this.value);
    }
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
  
  effectOnValue(value) {
    if (this.type !== MEAVER_TYPE.ENUM) return;
    return this.config.effectFn(value);
  }

  costAt(value) {
    const cost = this.config.cost;
    switch (this.type) {
      case MEAVER_TYPE.BOOLEAN:
        if (value === this.defaultValue) return 0;
        return cost;
      case MEAVER_TYPE.NUMBER:
        if (value === this.defaultValue) return 0;
        return cost(value)
      case MEAVER_TYPE.DECIMAL:
        if (value.eq(this.defaultValue)) return 0;
        return cost(value)
      case MEAVER_TYPE.ENUM:
        if (value === this.defaultValue) return 0;
        return cost[value];
      default:
        throw new Error("Unknown type of Mechanic Meaver item.");
    }
  }
  
  get cost() {
    const cost = this.costAt(this.valueToModify) - this.costAt(this.value);
    if (cost < 0) {
      return Math.ceil(cost / 2);
    }
    return cost;
  }
  
  get isAffordable() {
    return Currency.logicFragments.gte(this.cost);
  }
  
  get valueIsModified() {
    if (this.type === MEAVER_TYPE.DECIMAL) return this.valueToModify.neq(this.value);
    return this.valueToModify !== this.value;
  }
  
  get canBeModified() {
    const condition = this.config.condition;
    if (typeof condition === "function") {
      return condition(this.valueToModify);
    }
    return true;
  }
  
  get name() {
    return this.config.name.toUpperCase();
  }
  
  modify() {
    MechanicMeaver.logInfoToConsole(`Attempt to modify "${this.name}".`);
    if (!this.isAffordable) {
      MechanicMeaver.logInfoToConsole(`Failed to modify. (Error: Not enough Fragments)`);
      return;
    } else if (!this.valueIsModified) {
      MechanicMeaver.logInfoToConsole(`Failed to modify. (Error: Nothing is modified)`);
      return;
    } else if (!this.canBeModified) {
    MechanicMeaver.logInfoToConsole(`Failed to modify. (Error: This modification is not allowed)`);
      return;
    }
    Currency.logicFragments.subtract(this.cost);
    if (this.cost > 0) {
      MechanicMeaver.logInfoToConsole(`The modification costs ${quantify("Fragment", this.cost, 2)}.`);
    } else if (this.cost === 0) {
      MechanicMeaver.logInfoToConsole(`The modification costs or returns no Fragments.`);
    } else {
      MechanicMeaver.logInfoToConsole(`The modification returns ${quantify("Fragment", -this.cost, 2)} with lower effective.`);
    }
    player.logic.spentFragments += this.cost;
    this.value = this.valueToModify;
    MechanicMeaver.logInfoToConsole(`"${this.name}" modified successfully.`);
    const onSaving = this.config.onSaving;
    if (onSaving !== undefined) {
      onSaving(this.effectOnValue(this.value));
    }
  }
  
  get defaultValue() {
    return this.config.default;
  }
  
  resetToDefault() {
    this.value = this.defaultValue;
    this.valueToModify = this.defaultValue;
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
  
  debugConsole: ["Welcome to Mechanic Meaver!"],
  
  logThreshold: 15,
  
  logInfoToConsole(message) {
    this.debugConsole.push(message);
    if (this.debugConsole.length >= this.logThreshold) {
      this.debugConsole.shift();
    }
    EventHub.dispatch(GAME_EVENT.DEBUG_CONSOLE_UPDATE);
  },
  
  reset(auto) {
    const all = this.mechanics.all;
    for (const item of all) {
      item.resetToDefault();
    }
    Currency.logicFragments.value += player.logic.spentFragments;
    if (!auto) {
      if (player.logic.spentFragments > 0) {
        MechanicMeaver.logInfoToConsole(`All modifications are reset, returning ${quantify("Fragment", player.logic.spentFragments, 2)}.`);
      } else {
        MechanicMeaver.logInfoToConsole(`All modifications are reset, returning no Fragments.`);
      }
    }
    player.logic.spentFragments = 0;
  }
}

class LogicFragmentTypeState extends GameMechanicState {
  get requirement() {
    return this.config.requirement;
  }

  get isReached() {
    return Currency.logicFragments.gte(this.requirement);
  }
  
  get lfPerEternity() {
    return this.config.lfPerEternity;
  }
}

export const LogicFragmentTypes = mapGameDataToObject(
  GameDatabase.logic.logicFragments,
  config => new LogicFragmentTypeState(config)
);

export const LogicFragment = {
  types: LogicFragmentTypes.all.sort((a, b) => a.id - b.id),
  
  get current() {
    for (let i = this.types.length - 1; i >= 0; i--) {
      const type = this.types[i];
      if (type.isReached) return type;
    }
    throw new Error("Unknown Stage of Logic Fragments.");
  },
  
  handleEternity(auto) {
    const lfPerEternity = this.current.lfPerEternity;
    if (lfPerEternity <= 0) return;
    Currency.logicFragments.add(lfPerEternity);
    if (!auto) {
      MechanicMeaver.logInfoToConsole(`You have got ${quantify("Fragment", lfPerEternity, 2)} by Eternity.`);
    }
  },
  
  get totalLF() {
    return Currency.logicFragments.value + player.logic.spentFragments;
  }
}