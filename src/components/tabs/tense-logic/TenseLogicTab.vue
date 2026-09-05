<script>
import TenseBoostRow from "./TenseBoostRow";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "TenseLogicTab",
  components: {
    TenseBoostRow,
    PrimaryButton
  },
  data() {
    return {
      isUnlocked: false,
      past: 0,
      current: 0,
      weightAdjustment: WEIGHT_ADJUSTMENT_TYPE.ONE
    }
  },
  computed: {
    boosts() { return TenseBoost.all; },
    weightText() {
      switch (this.weightAdjustment) {
        case WEIGHT_ADJUSTMENT_TYPE.ONE:
          return formatInt(1);
        case WEIGHT_ADJUSTMENT_TYPE.TEN:
          return formatInt(10);
        case WEIGHT_ADJUSTMENT_TYPE.HUNDRED:
          return formatInt(100);
      }
      return "Unknown";
    }
  },
  watch: {
    weightAdjustment(newValue) {
      player.tense.weightAdjustmentType = newValue;
    }
  },
  methods: {
    update() {
      this.isUnlocked = TenseLogic.isUnlocked;
      if (!this.isUnlocked) return;
      this.past = player.tense.pastScore;
      this.current = TenseLogic.score;
      this.achUnlocked = player.tense.logicAchievementUnlocked;
      this.weightAdjustment = player.tense.weightAdjustmentType;
    },
    formatScore(score) {
      if (score >= 1e6) return format(score, 3);
      return formatInt(score);
    },
    toggleAdjustment() {
      switch (this.weightAdjustment) {
        case WEIGHT_ADJUSTMENT_TYPE.ONE:
          this.weightAdjustment = WEIGHT_ADJUSTMENT_TYPE.TEN;
          break;
        case WEIGHT_ADJUSTMENT_TYPE.TEN:
          this.weightAdjustment = WEIGHT_ADJUSTMENT_TYPE.HUNDRED;
          break;
        case WEIGHT_ADJUSTMENT_TYPE.HUNDRED:
          this.weightAdjustment = WEIGHT_ADJUSTMENT_TYPE.ONE;
          break;
      }
    }
  }
}
</script>

<template>
  <div class="c-tense-tab">
    <div v-if="isUnlocked">
      <div class="c-subtab-option-container">
        <PrimaryButton
          class="o-primary-btn--subtab-option"
          @click="toggleAdjustment()"
        >
          Adjust Weight: ±{{ weightText }}
        </PrimaryButton>
      </div>
      <div class="c-tense-description">
        <span>The score for each Eternity is based on your IP, highest dimension, and time.</span>
        <span>You can distribute your current score into the boosts below, which will apply in the next Eternity.</span>
      </div>
      
      <div class="l-tense-scores">
        <div class="c-tense-score-card">
          <span class="c-tense-score-card__label">Past Tense Score: </span>
          <span class="c-tense-score-card__value">{{ formatScore(past) }}</span>
        </div>
        <div class="c-tense-score-card">
          <span class="c-tense-score-card__label">Current Tense Score: </span>
          <span class="c-tense-score-card__value">{{ formatScore(current) }}</span>
        </div>
      </div>

      <div class="c-tense-boosts-title">Available Boosts</div>
      <div class="l-tense-boosts-container">
        <TenseBoostRow
          v-for="boost in boosts"
          :key="boost.id"
          :boost="boost"
        />
      </div>
    </div>

    <div v-else class="c-tense-locked-container">
      <i class="fas fa-lock" />
      Achieve Eternity in {{ formatInt(30) }} minutes (game-time) to unlock Tense Logic.
    </div>
  </div>
</template>

<style scoped>
.c-tense-tab {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  padding: 1rem 0;
}

.c-tense-description {
  font-size: 1.2rem;
  color: var(--color-text);
  line-height: 1.6;
  max-width: 80%;
  margin: 0.5rem auto;
  display: flex;
  flex-direction: column;
}

.l-tense-scores {
  display: flex;
  flex-direction: row;
  margin: 1rem 0 1.5rem 0;
  flex-wrap: wrap;
}

.c-tense-score-card {
  background-color: var(--color-base);
  border: 1px solid var(--color-tense);
  border-radius: var(--var-border-radius, 0.6rem);
  padding: 0.8rem 2rem 0.8rem 2rem;
  display: flex;
  align-items: center;
  flex: 1;
  margin: 0 3rem;
}

.c-tense-score-card__label {
  color: var(--color-text);
  font-size: 1.4rem;
}

.c-tense-score-card__value {
  color: var(--color-text);
  font-size: 1.8rem;
  font-weight: bold;
  margin: 0 0.8rem;
}
.c-tense-boosts-title {
  color: var(--color-tense);
  font-size: 1.6rem;
  font-weight: bold;
  border-bottom: 1px solid rgba(79, 176, 165, 0.3);
  padding-bottom: 0.6rem;
  margin-top: 1rem;
  width: 100%;
  display: flex;
  align-items: center;
}

.l-tense-boosts-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  width: 100%;
  justify-content: flex-start;
  padding-top: 0.5rem;
  flex-direction: column;
}

.c-tense-locked-container {
  border: 1px solid var(--color-bad);
  background-color: rgba(255, 0, 0, 0.08);
  border-radius: var(--var-border-radius, 1rem);
  padding: 2.5rem 2rem;
  text-align: center;
  font-size: 1.5rem;
  color: var(--color-text);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.c-tense-locked-container span {
  color: var(--color-bad);
  font-weight: bold;
  text-shadow: 0 0 10px var(--color-bad);
}

.o-unlock-logic-achievement-btn {
  width: 25rem;
  height: 10rem;
  margin: 3rem 0;
  padding: 2.5rem 2rem;
  font-size: 1.5rem;
}
</style>