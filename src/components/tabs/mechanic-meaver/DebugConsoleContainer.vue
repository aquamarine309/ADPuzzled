<script>
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "DebugConsoleContainer",
  components: {
    PrimaryButton
  },
  data() {
    return {
      info: []
    }
  },
  created() {
    this.on$(GAME_EVENT.DEBUG_CONSOLE_UPDATE, () => this.updateInfo());
    this.updateInfo();
  },
  methods: {
    updateInfo() {
      this.info = MechanicMeaver.debugConsole;
      this.$nextTick(() => {
         const el = this.$refs.debugConsole;
         el.scrollTop = el.scrollHeight;
      });
    },
    resetConsole() {
      MechanicMeaver.debugConsole = [];
      EventHub.dispatch(GAME_EVENT.DEBUG_CONSOLE_UPDATE);
    }
  }
}
</script>

<template>
  <div class="l-debug-console-container">
    <div
      class="l-message-container"
      ref="debugConsole"
    >
      <div
        v-for="(msg, idx) of info"
        :key="idx"
        class="c-debug-console-message"
      >
        &gt; {{ msg }}
      </div>
    </div>
    <PrimaryButton
      class="o-primary-btn--meaver c-reset-console-btn"
      @click="resetConsole"
    >
      <i class="fas fa-retweet"></i> Clear
    </PrimaryButton>
  </div>
</template>

<style scoped>
.l-debug-console-container {
  width: 100%;
  height: 30rem;
  color: var(--color-meaver-text);
  display: flex;
  flex-direction: column;
  border-radius: var(--var-border-radius, 0.5rem);
  margin: 1.2rem 1rem;
  padding: 3rem;
  position: relative;
}

.l-message-container {
  overflow-x: hidden;
  overflow-y: auto;
  background: var(--color-meaver-background);
  width: 100%;
  height: 100%;
  padding: 1rem 2rem;
}

.c-debug-console-message {
  width: 100%;
  padding: 0.8rem 1.5rem;
  text-align: left;
  font-size: 1.3rem;
  margin: 0.3rem;
}

.c-debug-console-message:not(:last-child) {
  border-bottom: 0.1rem solid var(--color-meaver-text);
}

.c-reset-console-btn {
  position: absolute;
  right: 5.5rem;
  top: 4rem;
  opacity: 0;
  transition-duration: 0.1s;
}

.l-debug-console-container:hover .c-reset-console-btn {
  opacity: 1;
}
</style>