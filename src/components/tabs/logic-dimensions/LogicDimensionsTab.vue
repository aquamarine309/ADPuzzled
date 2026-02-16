<script>
import LogicDimensionRow from "./LogicDimensionRow";
import PrimaryButton from "@/components/PrimaryButton";
import TriggerCrisisButton from "./TriggerCrisisButton";

export default {
  name: "LogicDimensionsTab",
  components: {
    LogicDimensionRow,
    PrimaryButton,
    TriggerCrisisButton
  },
  data() {
    return {
      axioms: new Decimal(),
      multiplier: new Decimal(),
      power: 1,
      penalty: new Decimal(),
      gain: new Decimal(),
      crisisUnlocked: false
    }
  },
  computed: {
    
  },
  methods: {
    update() {
      this.axioms.copyFrom(Currency.axioms);
      this.multiplier.copyFrom(getAxiomBonus());
      this.gain.copyFrom(LogicDimension(1).productionPerSecond);
      this.power = getAxiomPower();
      this.penalty = Crisis.penalty;
      this.crisisUnlocked = Crisis.crises > 0;
    },
    respecAll() {
      LogicDimensions.respecAll();
    }
  }
}
</script>

<template>
  <div class="l-logic-dim-tab l-centered-vertical-tab">
    <div class="c-subtab-option-container">
      <PrimaryButton
        class="o-primary-btn--subtab-option"
        @click="respecAll"
      >
        Respec all
      </PrimaryButton>
    </div>
    <div>
      <TriggerCrisisButton />
    </div>
    <div>
      <p>You have <span class="c-logic-dim-description__accent">{{ format(axioms, 2) }}</span> Axioms, which multiply Logic Points by <span class="c-logic-dim-description__accent">{{ formatX(multiplier, 2) }}</span>.</p>
      <p v-if="crisisUnlocked">Crises makes all Logic Dimensions {{ formatX(penalty, 2, 3) }} slower, but boosts Logic Point Multiplier by {{ formatPow(power, 1, 1) }}.</p>
      <p v-else>Reach {{ format(1e4) }} Axioms to trigger a crisis</p>
      <p>You are getting {{ quantify("Axiom", gain, 2) }} per second.</p>
    </div>
    <div>
      <LogicDimensionRow
        v-for="tier in 1"
        :key="tier"
        :tier="tier"
      />
    </div>
    <div>
      <p>Respec will perform an <b>Infinity</b> reset, and return your antiatoms.</p>
    </div>
  </div>
</template>

<style scoped>

</style>