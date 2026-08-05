<script>
export default {
  name: "TenseLogicTab",
  data() {
    return {
      isUnlocked: false,
      past: 0,
      current: 0
    }
  },
  methods: {
    update() {
      this.isUnlocked = TenseLogic.isUnlocked;
      if (!this.isUnlocked) return;
      this.past = player.tense.pastScore;
      this.current = TenseLogic.score;
    },
    formatScore(score) {
      if (score >= 1e6) return format(score, 3);
      return format(score);
    }
  }
}
</script>

<template>
  <div class="c-tense-tab">
    <div v-if="isUnlocked">
      <div class="c-tense-description">
        The score for each Eternity is based on your IP, highest dimension, and time. You can distribute your current score into the boosts below, which will apply in the next Eternity.
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
        <!-- TODO -->
      </div>
    </div>

    <div v-else class="c-tense-locked-container">
      <i class="fas fa-lock" />
      Achieve Eternity in {{ formatInt(1) }} minute to unlock Tense Logic.
    </div>
  </div>
</template>

<style scoped>
.c-tense-tab {
  --color-tense: #FA9FE2;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  padding: 1rem 0;
}

.c-tense-description {
  font-size: 1.4rem;
  color: var(--color-text);
  line-height: 1.6;
  width: 100%;
  margin-bottom: 0.5rem;
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
  border-radius: 0.6rem;
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
}

.c-tense-locked-container {
  border: 1px solid var(--color-bad);
  background-color: rgba(255, 0, 0, 0.08);
  border-radius: 1rem;
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
</style>