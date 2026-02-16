<script>
export default {
  name: "BigCrunchButton",
  data() {
    return {
      isModern: false,
      smallCrunch: false,
      shouldDisplay: false
    };
  },
  computed: {
    buttonTexts() {
      return ["Big Crunch", "Infinity", "Big Lunch", "Big Chunch", "Big Church", "Eternity", "Reality", "Bit Crunch", "大脆"];
    },
    buttonIds() {
      const len = this.buttonTexts.length;
      return Array.range(1, 32).map(() => Math.floor(Math.random() * len));
    }
  },
  methods: {
    update() {
      this.shouldDisplay = !player.break && Player.canCrunch;
      if (!this.shouldDisplay) return;
      this.isModern = player.options.newUI;
      this.smallCrunch = Time.bestInfinityRealTime.totalMinutes <= 1;
    },
    handleClick(id) {
      if (id !== 0) this.$recompute("buttonIds");
      else if (PlayerProgress.infinityUnlocked()) bigCrunchResetRequest();
      else Modal.bigCrunch.show();
    },
    id(x, y) {
      return (x - 1) * 4 + (y - 1);
    }
  }
};
</script>

<template>
  <div
    v-if="shouldDisplay"
    class="l-big-crunch"
  >
    <div v-if="isModern">
      <h3
        v-if="!smallCrunch"
        class="l-spacing"
      >
        The world has collapsed due to excess antimatter.
      </h3>
      <button
        v-if="smallCrunch"
        class="btn-big-crunch btn-big-crunch--small"
        @click="handleClick(0)"
      >
        Big Crunch
      </button>
      <div
        v-for="i in 8"
        v-else
        :key="i - 1"
        class="o-big-crunch-btn-container"
      >
        <div
          v-for="j in 4"
          :key="id(i, j)"
          class="o-big-crunch-btn-row"
        >
          <button
            class="btn-big-crunch"
            @click="handleClick(buttonIds[id(i, j)])"
          >
            {{ buttonTexts[buttonIds[id(i, j)]] }}
          </button>
        </div>
      </div>
    </div>
    <div v-else>
      <button
        v-if="smallCrunch"
        class="o-tab-btn o-big-crunch-btn l-old-ui__big-crunch-btn l-old-ui__big-crunch-btn--overlay"
        @click="handleClick(0)"
      >
        Big Crunch
      </button>
      <div
        v-for="i in 8"
        v-else
        :key="i - 1"
        class="o-big-crunch-btn-container"
      >
        <div
          v-for="j in 4"
          :key="id(i, j)"
          class="o-big-crunch-btn-row"
        >
          <button
            class="o-tab-btn o-big-crunch-btn l-old-ui__big-crunch-btn"
            @click="handleClick(buttonIds[id(i, j)])"
          >
            {{ buttonTexts[buttonIds[id(i, j)]] }}
          </button>
        </div>
      </div>
      <div
        v-if="!smallCrunch"
        class="o-emptiness"
      >
        The world has collapsed due to excess of antimatter.
      </div>
    </div>
  </div>
</template>

<style scoped>
.l-spacing {
  margin-top: 1rem;
}

.o-big-crunch-btn-container {
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: colunn;
}

.o-big-crunch-btn-row {
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: row;
  height: 10rem;
  margin: 1rem 0;
}

.l-big-crunch {
  width: 100%;
}
</style>
