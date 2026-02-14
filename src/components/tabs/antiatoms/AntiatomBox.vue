<script>
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "AntiatomBox",
  components: {
    PrimaryButton
  },
  props: {
    antiatom: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      level: 0,
      amount: 0,
      amountCost: new Decimal(0),
      levelCost: new Decimal(0),
      amountAffordable: false,
      levelAffordable: false,
      effect: new Decimal(0)
    }
  },
  computed: {
    config() {
      return this.antiatom.config;
    },
    name() {
      return `Anti${this.config.name}`;
    },
    state() {
      if (this.level === 0) return "Ground State";
      return "Excited State";
    },
    effectText() {
      const text = this.config.formatEffect(this.effect);
      return this.config.description.replaceAll("{value}", `<span class="o-antiatom-box--effect-value">${text}</span>`);
    },
    milestones() {
      return this.antiatom.milestones;
    },
    stateStyle() {
      return {
        "antiatom-state": true,
        "antiatom-state--excited": this.level > 0
      }
    }
  },
  methods: {
    update() {
      const antiatom = this.antiatom;
      this.level = antiatom.level;
      this.amount = antiatom.amount;
      this.amountAffordable = antiatom.amountAffordable;
      this.levelAffordable = antiatom.levelAffordable;
      this.amountCost = antiatom.amountCost;
      this.levelCost = antiatom.levelCost;
      this.effect = antiatom.effectValue;
    },
    formatCost(value) {
      return this.config.formatCost(value);
    },
    purchase() {
      this.antiatom.purchase();
    },
    levelUp() {
      this.antiatom.levelUp();
    }
  }
}
</script>

<template>
  <div class="antiatom-box">
    <div class="antiatom-header">
      <span class="antiatom-name">{{ name }} [{{ formatInt(amount) }}]</span>
      <span>
        <span class="antiatom-level">Level {{ formatInt(level) }}</span>
        <span :class="stateStyle">({{ state }})</span>
      </span>
    </div>
    
    <div class="antiatom-effect" v-html="effectText"></div>
    <div
      class="antiatom-milestones"
      v-if="milestones.length > 0"
    >
      <div class="antiatom-milestones-title">Milestones</div>
      <div class="antiatom-milestones-list">
        <div 
          v-for="(milestone, index) in milestones" 
          :key="index"
          class="antiatom-milestone-item"
          :class="{ 'completed': milestone.isReached }"
        >
          <span class="milestone-desc">{{ milestone.config.description }}</span>
          <span class="milestone-req">({{ formatInt(milestone.requirement) }})</span>
        </div>
      </div>
    </div>
    
    <div class="antiatom-actions">
      <PrimaryButton
        :enabled="amountAffordable"
        @click="purchase"
      >
        Buy one: {{ formatCost(amountCost) }}
      </PrimaryButton>
      <PrimaryButton
        :enabled="levelAffordable"
        @click="levelUp"
      >
        Level up: {{ formatCost(levelCost) }}
      </PrimaryButton>
    </div>
  </div>
</template>

<style scoped>
.antiatom-box {
  display: flex;
  flex-direction: column;
  background: rgba(20, 30, 45, 0.8);
  border: 1px solid #3a4a6a;
  border-radius: 8px;
  padding: 16px;
  margin: 8px 0;
  color: #e0e8ff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.antiatom-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px dashed #4a6a9a;
}

.antiatom-name {
  font-size: 1.4rem;
  font-weight: 600;
  color: #b0e0ff;
  letter-spacing: 1px;
}

.antiatom-level {
  font-size: 1rem;
  color: #aac8ff;
  background: rgba(60, 100, 160, 0.3);
  padding: 4px 12px;
  border-radius: 20px;
  border: 1px solid #5a8ac0;
}

.antiatom-state {
  font-size: 0.9rem;
  color: #90c8ff;
  margin-left: 8px;
}

.antiatom-effect {
  display: flex;
  background: rgba(0, 20, 40, 0.5);
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 16px;
  font-size: 0.95rem;
  line-height: 1.5;
  border-left: 4px solid #6a8ac0;
}

.antiatom-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: flex-start;
  align-items: center;
}

.antiatom-actions .o-primary-btn {
  flex: 0 1 auto;
  min-width: 180px;
  padding: 5px 10px;
}

.antiatom-box:has(.antiatom-state--excited) {
  border-color: #8ab0ff;
  background: linear-gradient(145deg, rgba(30, 40, 60, 0.9), rgba(40, 60, 90, 0.8));
}

.antiatom-box:has(.antiatom-state--excited) .antiatom-name {
  color: #ffe09c;
  text-shadow: 0 0 8px rgba(255, 200, 100, 0.3);
}

.antiatom-box:hover {
  border-color: #8ab0ff;
  background: rgba(30, 45, 65, 0.9);
  transition: all 0.2s ease;
}

.antiatom-milestones {
  display: flex;
  flex-direction: column;
  margin: 16px 0;
  padding-top: 12px;
  border-top: 1px solid #4a6a9a;
}

.antiatom-milestones-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #b0d0ff;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
}

.antiatom-milestones-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.antiatom-milestone-item {
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-size: 0.9rem;
  padding: 4px 8px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.2);
}

.antiatom-milestone-item.completed {
  opacity: 0.9;
  background: rgba(80, 200, 120, 0.1);
  border-left: 3px solid #50c87a;
}

.milestone-check {
  color: #4a6a9a;
  font-weight: bold;
  width: 18px;
  text-align: center;
}

.completed .milestone-check {
  color: #50c87a;
}

.milestone-desc {
  flex: 1;
  color: #e0e8ff;
}

.completed .milestone-desc {
  color: #c0ffc0;
}

.milestone-req {
  color: #a0b8d0;
  font-size: 0.85rem;
}
</style>