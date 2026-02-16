<script>
export default {
  name: "TriggerCrisisButton",
  data() {
    return {
      isVisible: false,
      canTrigger: false,
      requirement: new Decimal(),
      bulk: new Decimal()
    }
  },
  methods: {
    update() {
      this.canTrigger = Crisis.canTrigger;
      this.isVisible = this.canTrigger || Crisis.crises > 0;
      this.requirement = Crisis.requirement;
      this.bulk = Crisis.bulk;
    },
    trigger() {
      Crisis.requestTrigger();
    }
  }
}
</script>

<template>
  <button
    v-if="isVisible"
    class="o-trigger-crisis-button"
    :disabled="!canTrigger"
    @click="trigger"
  >
    <span v-if="bulk > 1">Trigger {{ formatInt(bulk) }} Crises</span>
    <span v-if="canTrigger">Trigger a Crisis</span>
    <span v-else>Reach {{ format(requirement) }} Axioms to trigger a crisis</span>
  </button>
</template>

<style scoped>
.o-trigger-crisis-button {
  width: 21rem;
  height: 9rem;
  border: 0.4rem solid var(--color-bad);
  margin: 1rem;
  padding: 1rem;
  border-radius: 0.5rem;
  background: var(--color-base);
  color: var(--color-bad);
  font-size: 2rem;
  font-weight: bold;
}

.o-trigger-crisis-button:disabled {
  opacity: 0.6;
}
</style>