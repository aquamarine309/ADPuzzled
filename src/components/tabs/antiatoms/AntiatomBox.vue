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
      left: 0,
      amountCost: new Decimal(0),
      levelCost: new Decimal(0),
      amountAffordable: false,
      levelAffordable: false,
      effect: new Decimal(0),
      isEnergyUnlocked: false,
      energy: new Decimal(0),
      energyPerSecond: new Decimal(0),
      energyBoost: new Decimal(0),
      effectNoEnergy: new Decimal(0)
    }
  },
  computed: {
    id() {
      return this.config.id;
    },
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
    },
    amountText() {
      if (this.amount === this.left) return formatInt(this.amount);
      return `${formatInt(this.amount)} - ${formatInt(this.amount - this.left)} = ${formatInt(this.left)}`;
    },
    isCharging() {
      return this.$viewModel.chargedAtom === this.id;
    },
    effMult() {
      return Decimal.div(this.effect, this.effectNoEnergy);
    }
  },
  methods: {
    update() {
      const antiatom = this.antiatom;
      this.level = antiatom.level;
      this.amount = antiatom.amount;
      this.left = antiatom.left;
      this.amountAffordable = antiatom.amountAffordable;
      this.levelAffordable = antiatom.levelAffordable;
      this.amountCost = antiatom.amountCost;
      this.levelCost = antiatom.levelCost;
      this.effect = antiatom.effectValue;
      this.isEnergyUnlocked = antiatom.isEnergyUnlocked;
      if (!this.isEnergyUnlocked) return;
      this.energy.copyFrom(antiatom.energy);
      this.energyPerSecond.copyFrom(antiatom.energyPerSecond);
      this.energyBoost = antiatom.energyBoost;
      this.effectNoEnergy = antiatom.effectNoEnergy;
    },
    formatCost(value) {
      return this.config.formatCost(value);
    },
    purchase() {
      this.antiatom.purchase();
    },
    levelUp() {
      this.antiatom.levelUp();
    },
    startCharge() {
      this.$viewModel.chargedAtom = this.id;
    },
    endCharge() {
      this.$viewModel.chargedAtom = 0;
    },
    formatEffect(value) {
      if (value.lt(2)) return `+${formatPercents(value.toNumber() - 1, 2)}`;
      return formatX(value, 2, 3);
    }
  }
}
</script>

<template>
  <div class="antiatom-box">
    <div class="antiatom-header">
      <span class="antiatom-name">{{ name }} [{{ amountText }}]</span>
      <span>
        <span class="antiatom-level">Level {{ formatInt(level) }}</span>
        <span :class="stateStyle">({{ state }})</span>
      </span>
    </div>
    
    <div class="antiatom-effect" v-html="effectText"></div>
    <div class="antiatom-energy" v-if="isEnergyUnlocked">
      <div class="energy-bar">
        <div class="energy-label">
          Antiatom Energy: {{ format(energy, 2, 1) }}
          <span class="energy-bonus">(LD{{ id }} {{ formatX(energyBoost, 2, 3) }})</span>
          <span class="energy-bonus">(Effect {{ formatEffect(effMult) }})</span>
        </div>
        <div class="energy-rate">
          Gain: {{ format(energyPerSecond, 2, 1) }}/sec
        </div>
      </div>
      
      <div class="charge-container">
        <button 
          class="charge-button o-longpress-support" 
          @mousedown="startCharge" 
          @mouseup="endCharge"
          @mouseleave="endCharge"
          @touchstart="startCharge"
          @touchend="endCharge"
          :class="{ charging: isCharging }"
        >
          <span v-if="isCharging">
            Charging
          </span>
          <span v-else>
            Long press to multiply gain
          </span>
        </button>
      </div>
    </div>
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
  border: 0.1rem solid #3a4a6a;
  border-radius: var(--var-border-radius, 0.8rem);
  padding: 1.6rem;
  margin: 0.8rem 0;
  color: #e0e8ff;
  box-shadow: 0 0.2rem 0.8rem rgba(0, 0, 0, 0.3);
}

.antiatom-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 1.2rem;
  padding-bottom: 0.8rem;
  border-bottom: 0.1rem dashed #4a6a9a;
}

.antiatom-name {
  font-size: 1.4rem;
  font-weight: 600;
  color: #b0e0ff;
  letter-spacing: 0.1rem;
}

.antiatom-level {
  font-size: 1rem;
  color: #aac8ff;
  background: rgba(60, 100, 160, 0.3);
  padding: 0.4rem 1.2rem;
  border-radius: var(--var-border-radius, 2rem);
  border: 0.1rem solid #5a8ac0;
}

.antiatom-state {
  font-size: 0.9rem;
  color: #90c8ff;
  margin-left: 0.8rem;
}

.antiatom-effect {
  display: flex;
  background: rgba(0, 20, 40, 0.5);
  padding: 1.2rem;
  border-radius: var(--var-border-radius, 0.6rem);
  margin-bottom: 1.6rem;
  font-size: 0.95rem;
  line-height: 1.5;
  border-left: 0.4rem solid #6a8ac0;
}

.antiatom-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1.2rem;
  justify-content: flex-start;
  align-items: center;
}

.antiatom-actions .o-primary-btn {
  flex: 0 1 auto;
  min-width: 18rem;
  padding: 0.5rem 1rem;
}

.antiatom-box:has(.antiatom-state--excited) {
  border-color: #8ab0ff;
  background: linear-gradient(145deg, rgba(30, 40, 60, 0.9), rgba(40, 60, 90, 0.8));
}

.antiatom-box:has(.antiatom-state--excited) .antiatom-name {
  color: #ffe09c;
  text-shadow: 0 0 0.8rem rgba(255, 200, 100, 0.3);
}

.antiatom-box:hover {
  border-color: #8ab0ff;
  background: rgba(30, 45, 65, 0.9);
  transition: all 0.2s ease;
}

.antiatom-milestones {
  display: flex;
  flex-direction: column;
  margin: 1.6rem 0;
  padding-top: 1.2rem;
  border-top: 0.1rem solid #4a6a9a;
}

.antiatom-milestones-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #b0d0ff;
  text-transform: uppercase;
  letter-spacing: 0.1rem;
  margin-bottom: 0.8rem;
}

.antiatom-milestones-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.antiatom-milestone-item {
  display: flex;
  align-items: baseline;
  gap: 0.8rem;
  font-size: 0.9rem;
  padding: 0.4rem 0.8rem;
  border-radius: var(--var-border-radius, 0.4rem);
  background: rgba(0, 0, 0, 0.2);
}

.antiatom-milestone-item.completed {
  opacity: 0.9;
  background: rgba(80, 200, 120, 0.1);
  border-left: 0.3rem solid #50c87a;
}

.milestone-check {
  color: #4a6a9a;
  font-weight: bold;
  width: 1.8rem;
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

.antiatom-energy {
  display: flex;
  flex-direction: column;
  margin-top: 1.6rem;
  padding: 1.2rem;
  background: rgba(0, 20, 40, 0.6);
  border-radius: var(--var-border-radius, 0.6rem);
  border: 0.1rem solid #3a5f8a;
  font-size: 0.95rem;
}

.energy-bar {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 1.2rem;
  padding: 0 0.4rem;
}

.energy-label {
  color: #b0e0ff;
  font-weight: 500;
}

.energy-bonus {
  color: #a0ffa0;
  background: rgba(64, 128, 64, 0.2);
  padding: 0.2rem 0.8rem;
  border-radius: var(--var-border-radius, 1.2rem);
  margin-left: 0.8rem;
  font-size: 0.85rem;
  border: 0.1rem solid #408040;
}

.energy-rate {
  color: #90c8ff;
  font-size: 0.9rem;
  background: rgba(32, 64, 96, 0.4);
  padding: 0.2rem 1rem;
  border-radius: var(--var-border-radius, 1.6rem);
}

.charge-container {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.charge-button {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem 1.6rem;
  background: linear-gradient(145deg, #2a4055, #1a2a3a);
  border: 0.2rem solid #4a7a9a;
  border-radius: var(--var-border-radius, 0.8rem);
  color: #e0f0ff;
  font-weight: 600;
  font-size: 1rem;
  letter-spacing: 0.1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 0.2rem 0.4rem rgba(0, 0, 0, 0.3);
  text-shadow: 0 0.1rem 0.2rem rgba(0, 0, 0, 0.5);
  min-width: 16rem;
}

.charge-button.charging {
  background: linear-gradient(145deg, #4a7a5a, #2a4a3a);
  border-color: #8ac08a;
  box-shadow: 0 0 1.5rem rgba(128, 255, 128, 0.5);
  animation: pulse 1.5s infinite;
}

.charge-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  filter: grayscale(0.5);
}

.charge-preview {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem 1.2rem;
  background: rgba(64, 128, 192, 0.15);
  border-radius: var(--var-border-radius, 2rem);
  border: 0.1rem dashed #5a8ac0;
  color: #ffd78c;
  font-size: 0.9rem;
  animation: fadeIn 0.3s ease;
}

@keyframes pulse {
  0% { box-shadow: 0 0 1rem rgba(128, 255, 128, 0.5); }
  50% { box-shadow: 0 0 2rem rgba(128, 255, 128, 0.8); }
  100% { box-shadow: 0 0 1rem rgba(128, 255, 128, 0.5); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-0.5rem); }
  to { opacity: 1; transform: translateY(0); }
}

.energy-label :deep(.format-energy),
.charge-preview :deep(.format-energy) {
  color: #90f0ff;
  font-weight: 600;
  background: rgba(64, 128, 255, 0.2);
  padding: 0.2rem 0.6rem;
  border-radius: var(--var-border-radius, 0.4rem);
}

.energy-rate :deep(.format-rate) {
  color: #ffb86c;
  font-weight: bold;
}
</style>