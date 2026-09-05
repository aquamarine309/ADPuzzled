<script>
import LogicNodeComponent from "./LogicNodeComponent";
import LogicNodeConnection from "./LogicNodeConnection";
import BlobNode from "./BlobNode";
import HintText from "@/components/HintText";

export default {
  name: "LogicTreeTab",
  components: {
    LogicNodeComponent,
    LogicNodeConnection,
    BlobNode,
    HintText
  },
  data() {
    return {
      updateKey: 0,
      isUnlocked: false,
      canUnlock: false
    }
  },
  computed: {
    nodes() {
      return LogicTree.nodes.filter(x => x.isAvailable);
    },
    connections() {
      return LogicTree.connections.filter(c => c.every(x => x.isAvailable));
    },
    containerSize: () => 800,
    nodeRadius: () => 90,
    bgText() {
      const count = 36;
      return Array.repeat(0, count).map(() => {
        const x = this.containerSize * Math.random();
        const y = this.containerSize * Math.random();
        return {
          x, y,
          fontSize: 40 + 80 * Math.random(),
          rotate: `rotate(${Math.random() * 360}, ${x}, ${y})`
        }
      });
    },
    classObject() {
      return {
        "c-logic-upgrade-btn--bought": this.isUnlocked,
        "c-logic-upgrade-btn--possible": !this.isUnlocked && !this.canUnlock
      };
    },
    requirement: () => LogicTree.requirement
  },
  created() {
    this.on$(GAME_EVENT.LOGIC_NODE_UNLOCKED, () => {
      this.$recompute("nodes");
      this.$recompute("connections");
      this.updateKey++;
    });
  },
  methods: {
    update() {
      this.isUnlocked = player.tense.logicAchievementUnlocked;
      this.canUnlock = !this.isUnlocked && Currency.logicPoints.value.gte(this.requirement);
    },
    unlock() {
      if (this.canUnlock) {
        player.tense.logicAchievementUnlocked = true;
        GameUI.update();
      }
    },
  }
}
</script>

<template>
  <div>
    <div
      v-if="isUnlocked"
      class="c-logic-tree-layout"
    >
      <div class="c-logic-node-container">
        <div class="c-logic-tree-bg__gear c-logic-tree-bg__gear--top-left">
          <i class="fas fa-gear" />
        </div>
        <div class="c-logic-tree-bg__gear c-logic-tree-bg__gear--bottom-right">
          <i class="fas fa-gear" />
        </div>
        <LogicNodeComponent
          v-for="node in nodes"
          :node="node"
          :node-radius="nodeRadius"
          :container-size="containerSize"
          :key="node.id + 'node' + updateKey"
        />
        <BlobNode
          :node-radius="nodeRadius"
          :container-size="containerSize"
        />
      </div>
      <svg
        ref="svg"
        class="c-logic-tree-svg"
      >
        <text
          v-for="(info, index) in bgText"
          :key="index + 'background-time'"
          :x="info.x"
          :y="info.y"
          :font-size="info.fontSize"
          :transform="info.rotate"
          class="c-logic-tree-bg-text"
        >
          Δ
        </text>
        <LogicNodeConnection
          v-for="(connection, idx) in connections"
          :connection="connection"
          :node-radius="nodeRadius"
          :container-size="containerSize"
          :key="idx + 'connection' + updateKey"
        />
      </svg>
    </div>
    <div
      v-else
      class="c-locked-row"
    >
      <button
        :class="classObject"
        class="l-logic-upgrade-btn c-logic-upgrade-btn"
        @click="unlock"
      > 
        <HintText
          type="logicUpgrades"
          class="l-hint-text--logic-upgrade c-hint-text--logic-upgrade"
        >
          AD Puzzle 2
        </HintText>
        <span>Unlock Logic Achievements</span>
        <span class="c-logic-upgrade-btn__requirement">
          Requirenent: Reach {{ format(requirement) }} Logic Points
        </span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.c-locked-row {
  margin: 1rem;
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>