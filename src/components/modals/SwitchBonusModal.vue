<script>
import ModalWrapper from "@/components/modals/ModalWrapper";

export default {
  name: "SwitchBonusModal",
  components: {
    ModalWrapper
  },
  data() {
    return {
      current: "ExtraBonusToAD"
    }
  },
  computed: {
    bonus: () => ExtraBonus.all
  },
  methods: {
    update() {
      this.current = player.switchBonus;
    },
    switchBonus(id) {
      if (!ExtraBonus[id].isUnlocked) return;
      player.switchBonus = id;
    }
  }
}
</script>

<template>
  <ModalWrapper>
    <template #header>
      Switch your extra bonus!
    </template>
    <div>
      Note: You can use Alt + J to switch to the last one and Alt + K to switch to the next one.
    </div>
    <div>
      <div
        v-for="b in bonus"
        :key="b.id"
        class="o-bonus-row"
        :class="{
          'o-bonus-row--current': b.id === current,
          'o-bonus-row--locked': !b.isUnlocked
        }"
        @click="switchBonus(b.id)"
      >
        <span v-if="b.isUnlocked">{{ b.config.description(b.effectValue) }}</span>
        <span v-else><i class="fas fa-lock" /> BONUS LOCKED <i class="fas fa-lock" /></span>
      </div>
    </div>
  </ModalWrapper>
</template>

<style scoped>
.o-bonus-row {
  border: 0.1rem solid var(--color-extra);
  padding: 1.5rem 1rem;
  margin: 0.5rem 0.8rem;
  color: var(--color-extra);
  border-radius: var(--var-border-radius, 0.5rem);
  cursor: pointer;
}

.o-bonus-row--current {
  background: #a0f0606a;
  cursor: default;
}

.o-bonus-row--locked {
  color: var(--color-text);
  border-color: var(--color-text);
  cursor: default;
}
</style>