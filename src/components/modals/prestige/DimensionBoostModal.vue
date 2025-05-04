<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "DimensionBoostModal",
  components: {
    ModalWrapperChoice
  },
  props: {
    bulk: {
      type: Boolean,
      required: true,
    }
  },
  computed: {
    message() {
      const keepDimensions = Perk.antimatterNoReset.canBeApplied || Achievement(111).canBeApplied ||
        PelleUpgrade.dimBoostResetsNothing.isBought
        ? `not actually reset anything due to an upgrade you have which prevents Antimatter and Antimatter Dimensions
          from being reset in this situation. You will still gain the multiplier from the Boost, as usual.`
        : `reset your Antimatter and Antimatter Dimensions. Are you sure you want to do this?`;

      return `This will ${keepDimensions}`;
    },
  },
  methods: {
    handleYesClick() {
      if (player.dimensionBoosts !== 0 || player.galaxies !== 0 || PlayerProgress.infinityUnlocked()) return;
      requestDimensionBoost(this.bulk);
      EventHub.ui.offAll(this);
    }
  },
};
</script>

<template>
  <ModalWrapperChoice confirm-class="o-primary-btn--width-medium c-modal-message__okay-btn o-primary-btn--disabled">
    <template #header>
      You are about to do a
      <span
        class="o-dimboost-text"
        @click="handleYesClick"
      >
        Dimension Boost Reset
      </span>
    </template>
    <div class="c-modal-message__text">
      {{ message }}
    </div>
  </ModalWrapperChoice>
</template>

<style>
.o-dimboost-text {
  text-shadow: 0 0 0.2rem var(--color-text);
}
</style>