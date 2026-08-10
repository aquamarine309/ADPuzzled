<script>
import PrimaryButton from "@/components/PrimaryButton";
import DescriptionDisplay from "@/components/DescriptionDisplay";
import EffectDisplay from "@/components/EffectDisplay";

export default {
  name: "TenseBoostRow",
  components: {
    PrimaryButton,
    DescriptionDisplay,
    EffectDisplay
  },
  props: {
    boost: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      weight: 0,
      score: 0
    }
  },
  computed: {
    config() {
      return this.boost.config;
    },
    symbol() {
      return this.config.symbol;
    },
    thisBoostConfig() {
      return {
        effect: () => this.config.effectAt(this.boost.scoreAt(player.tense.pastScore)),
        formatEffect: this.config.formatEffect
      };
    },
    nextBoostConfig() {
      return {
        effect: () => this.config.effectAt(this.boost.scoreAt(TenseLogic.score)),
        formatEffect: this.config.formatEffect
      };
    },
  },
  watch: {
    weight(newValue) {
      this.boost.weight = newValue;
    }
  },
  methods: {
    update() {
      this.weight = this.boost.weight;
      this.score = this.boost.score;
    }
  }
}
</script>

<template>
  <div
    class="l-tense-boost-row"
    :style="{ '--color-boost': config.color }"
  >
    <div class="c-tense-boost-symbol">
      <span v-html="symbol" />
    </div>
    
    <div class="c-tense-boost-body">
      <div class="c-tense-boost-header">
        <DescriptionDisplay :config="config" />
      </div>
      
      <div class="c-tense-effects">
        <EffectDisplay 
          :config="thisBoostConfig" 
          label="This Eternity" 
        />
        <EffectDisplay 
          :config="nextBoostConfig" 
          label="Next Eternity" 
        />
      </div>
      <div class="c-tense-weight-controls">
        <PrimaryButton
          class="c-tense-btn"
          @click="weight--"
          :enabled="weight > 0"
        >
          -
        </PrimaryButton>
        <span class="c-tense-weight-display">{{ formatInt(weight) }}</span>
        <PrimaryButton
          class="c-tense-btn"
          @click="weight++"
        >
          +
        </PrimaryButton>
        <PrimaryButton
          class="c-tense-btn c-tense-btn-reset"
          @click="weight = 0"
        >
          Reset
        </PrimaryButton>
        <span>Current Score: {{ format(score) }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.l-tense-boost-row {
  --color-boost: var(--color-logic);
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
  padding: 1.2rem 1.5rem;
  margin-bottom: 1rem;
  border-radius: var(--var-border-radius, 1rem);
  transition: all 0.2s;
}

.l-tense-boost-row:hover {
  border-color: var(--color-boost);
}

.t-dark .l-tense-boost-row,
.t-amoled .l-tense-boost-row,
.t-s6 .l-tense-boost-row,
.t-s10 .l-tense-boost-row,
.t-s11 .l-tense-boost-row {
  background-color: rgba(0, 0, 0, 0.15);
  border: 1px solid transparent;
}

.t-dark .l-tense-boost-row:hover,
.t-amoled .l-tense-boost-row:hover,
.t-s6 .l-tense-boost-row:hover,
.t-s10 .l-tense-boost-row:hover,
.t-s11 .l-tense-boost-row:hover {
  background-color: rgba(0, 0, 0, 0.25);
  border-color: var(--color-boost);
}

.t-metro .l-tense-boost-row,
.t-s1 .l-tense-boost-row,
.t-s13 .l-tense-boost-row,
.t-s8 .l-tense-boost-row {
  background-color: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.t-metro .l-tense-boost-row:hover,
.t-s1 .l-tense-boost-row:hover,
.t-s13 .l-tense-boost-row:hover,
.t-s8 .l-tense-boost-row:hover {
  background-color: rgba(255, 255, 255, 0.9);
  border-color: var(--color-boost);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.c-tense-boost-symbol {
  width: 5rem;
  height: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2.2rem;
  border-radius: var(--var-border-radius, 50%);
  flex-shrink: 0;
  background-color: var(--color-base);
  color: var(--color-text);
  border: 0.2rem solid var(--color-boost);
}

.t-metro .c-tense-boost-symbol,
.t-s1 .c-tense-boost-symbol,
.t-s13 .c-tense-boost-symbol {
  box-shadow: 0 0 10px rgba(0,0,0,0.05);
}

.c-tense-boost-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 0.4rem;
}

.c-tense-boost-header {
  color: var(--color-text);
  font-weight: bold;
  font-size: 1.5rem;
  opacity: 0.9;
}

.c-tense-effects {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1.5rem;
  font-size: 1.3rem;
}
.c-tense-effects > :last-child {
  color: var(--color-logic);
}

.t-dark .c-tense-effects > :last-child {
  text-shadow: 0 0 1rem rgba(0,0,0,0.5);
}
.t-metro .c-tense-effects > :last-child,
.t-s1 .c-tense-effects > :last-child,
.t-s13 .c-tense-effects > :last-child {
  text-shadow: none;
  font-weight: bold;
}

.c-tense-weight-controls {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.8rem;
  margin-top: 0.4rem;
}

.c-tense-weight-display {
  font-size: 1.6rem;
  font-weight: bold;
  min-width: 3rem;
  text-align: center;
  color: var(--color-text);
}

.c-tense-btn {
  padding: 0.2rem 1.2rem;
  font-size: 1.4rem;
}

.c-tense-btn-reset {
  border-color: var(--color-bad) !important;
  color: var(--color-bad);
}
.c-tense-btn-reset:hover:not(:disabled) {
  background-color: var(--color-bad) !important;
  color: #ffffff !important;
}
</style>