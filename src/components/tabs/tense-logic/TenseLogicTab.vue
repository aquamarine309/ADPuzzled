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
    }
  }
}
</script>

<template>
  <div>
    <div v-if="isUnlocked">
      <div>Congratulations! You have unlocked Tense Logic. The next version will offically open it!</div>
      <div>Your past Tense Score is {{ formatInt(past) }}.</div>
      <div>Your this Tense Score is {{ formatInt(current) }}.</div>
    </div>
    <div v-else>Eternity in {{ formatInt(1) }} minute to unlock Tense Logic.</div>
  </div>
</template>

<style scoped>

</style>