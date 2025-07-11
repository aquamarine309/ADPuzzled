<script>
export default {
  name: "LogicFragmentContainer",
  data() {
    return {
      currentLF: 0,
      name: "",
      zeroPoint: 0,
      requirement: 0,
      lfPerEternity: 0,
      totalLF: 0,
      hasNext: false,
      respec: false
    }
  },
  computed: {
    percentage() {
      if (!this.hasNext) return 1;
      return (this.totalLF - this.zeroPoint) / this.requirement;
    },
    styleObject() {
      return {
        width: `${this.percentage * 100}%`
      };
    }
  },
  watch: {
    respec(value) {
      player.logic.respec = value;
    }
  },
  methods: {
    update() {
      const current = LogicFragment.current;
      const next = LogicFragment.types[current.id + 1];
      this.hasNext = next !== undefined;
      this.currentLF = Currency.logicFragments.value;
      this.totalLF = LogicFragment.totalLF;
      this.name = current.config.name;
      this.zeroPoint = current.requirement;
      if (this.hasNext) {
        this.requirement = next.requirement;
      }
      this.lfPerEternity = current.lfPerEternity;
      this.respec = player.logic.respec;
    }
  }
}
</script>

<template>
  <div>
    <div class="l-lf-grid">
      <div class="c-lf-info">
        <span>Current Stage</span>
        <span class="c-lf-info-main-data">{{ name }}</span>
      </div>
      <div class="c-lf-info">
        <span>Fragments (Current/Total)</span>
        <span class="c-lf-info-main-data">{{ format(currentLF, 2) }}/{{ format(totalLF, 2) }}</span>
      </div>
      <div
        v-tooltip="'Based on current stage'"
        class="c-lf-info"
      >
        <span>Fragments Per Eternity</span>
        <span class="c-lf-info-main-data">{{ format(lfPerEternity, 2) }}</span>
      </div>
      <div
        class="c-lf-info o-clickable"
        @click="respec = !respec"
        v-tooltip="respec ? 'Try to disable DLC' : 'Click to toggle'"
      >
        <span>Respec On Next Eternity</span>
        <span class="c-lf-info-main-data">{{ respec ? "Active" : "Inactive" }}</span>
      </div>
    </div>
    <div class="l-lf-grid">
      <div class="c-lf-info c-lf-info--wide">
        <span>Percentage to next stage</span>
        <div class="c-progress-bar-stage-and-info">
          <div class="c-progress-bar-stage--container">
            <div
              class="o-progress-bar-stage"
              :style="styleObject"
            />
          </div>
          <div class="c-lf-info-main-data">
            <span v-if="hasNext">{{ format(requirement, 2)}} ({{ formatPercents(percentage) }})</span>
            <span v-else>Max</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.l-lf-grid {
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  padding: 1rem 2rem;
  height: auto;
}

.c-lf-info {
  display: flex;
  flex: 1;
  margin: 0 1rem;
  background: var(--color-meaver-deep);
  color: var(--color-meaver-text);
  border-radius: var(--var-border-radius, 0.5rem);
  flex-direction: column;
  height: 100%;
  font-size: 1.2rem;
  padding: 0.5rem 0.8rem;
  text-align: left;
}

.c-lf-info-main-data {
  font-size: 2rem;
  font-weight: bold;
}

.c-progress-bar-stage--container {
  width: 75%;
  height: 1rem;
  border-radius: var(--var-border-radius, 0.8rem);
  background: var(--color-meaver-background);
  margin-right: 2rem;
}

.o-progress-bar-stage {
  transition-duration: 0.2s;
  background: var(--color-meaver-text);
  border-radius: var(--var-border-radius, 0.8rem);
  height: 100%;
}

.c-progress-bar-stage-and-info {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0.5rem 0;
}

.o-lf-respec-btn {
  font-size: 1.5rem;
  padding: 0.5rem 0.3rem;
  margin: 1rem 0.5rem;
  width: auto;
}

.o-clickable {
  cursor: pointer;
}
</style>