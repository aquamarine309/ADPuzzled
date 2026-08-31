import { GameMechanicState } from "./game-mechanics";

class LogicNodeState extends GameMechanicState {
  constructor(config) {
    super(config);
    this.registerEvents(config.checkEvent, args => this.tryUnlock(args));
    this._reqNodes = null;
  }

  updateReqNodes() {
    if (this.reqNodes) throw `Logic Node ${this.id} has been initialized.`;
    const reqNodes = this.config.reqNodes
      ? this.config.reqNodes.map(id => LogicTree.getNodeById(id))
      : [];
    this._reqNodes = reqNodes;
  }

  get reqNodes() {
    return this._reqNodes;
  }

  get isAvailable() {
    return this.reqNodes.every(x => x.isUnlocked);
  }

  tryUnlock(args) {
    if (!player.tense.logicAchievementUnlocked) return false;
    if (this.isUnlocked) return;
    if (!this.isAvailable) return;
    if (!this.config.checkRequirement(args)) return;
    this.unlock();
  }

  unlock() {
    player.logicNodes.add(this.id);
    GameUI.notify.logic(`You've unlocked Logic Achievement "${this.config.name}"`);
    EventHub.dispatch(GAME_EVENT.LOGIC_NODE_UNLOCKED);
  }

  lock() {
    player.logicNodes.delete(this.id);
  }

  get isUnlocked() {
    return player.logicNodes.has(this.id);
  }

  get isEffectActive() {
    return this.isUnlocked;
  }
}

export const LogicNode = mapGameDataToObject(
  GameDatabase.logic.logicTree,
  config => new LogicNodeState(config)
);

export const LogicTree = {
  nodes: LogicNode.all,

  getNodeById: null,

  connections: null
};

LogicTree.getNodeById = (function() {
  const idMap = {};
  for (const node of LogicTree.nodes) {
    idMap[node.id] = node;
  }
  return id => idMap[id];
})();

LogicTree.connections = (function() {
  return [
    [33, 32],
    [32, 41],
    [33, 23],
    [33, 43],
    [23, 12],
    [43, 52],
    [43, 54],
    [33, 34],
    [34, 25],
    [34, 45],
    [23, 14]
  ].map(c => c.map(x => LogicTree.getNodeById(x)))
})();

// Initialize
LogicTree.nodes.forEach(x => x.updateReqNodes());

EventHub.logic.on(GAME_EVENT.TAB_CHANGED, tab => {
  if (tab[0].key === "logic") {
    player.requirementChecks.eternity.noLogicTab = false;
  }
});