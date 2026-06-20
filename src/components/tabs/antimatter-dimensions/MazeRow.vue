<script>
import PrimaryButton from "@/components/PrimaryButton";
import PrimaryToggleButton from "@/components/PrimaryToggleButton";

export default {
  name: "MazeRow",
  components: {
    PrimaryButton,
    PrimaryToggleButton
  },
  data() {
    return {
      isUnlocked: false,
      mazeIngressing: false,
      mazeAM: new Decimal(),
      enoughLP: false
    }
  },
  watch: {
    mazeIngressing(value) {
      player.mazeIngressing = value;
    }
  },
  methods: {
    update() {
      this.isUnlocked = Puzzles.mazeUnlocked();
      if (!this.isUnlocked) return;
      this.mazeAM.copyFrom(player.mazeAM);
      this.enoughLP = getLogicPoints().gt(1);
      this.mazeIngressing = player.mazeIngressing;
    },
    egross() {
      if (!this.enoughLP || this.mazeAM.lte(0)) return;
      Currency.antimatter.add(player.mazeAM);
      player.mazeAM = new Decimal(0);
      resetAllResourceExchange();
    }
  }
}
</script>

<template>
  <div
    v-if="isUnlocked"
    class="l-maze-row"
  >
    <div>The maze holds {{ format(mazeAM, 2, 1) }} antimatter.</div>
    <div>When ingressing, antimatter producing will be stopped.</div>
    <div>Egressing antimatter will reset all Exchange.</div>
    <div>The maze automatically reset before Eternity, antimatter in which willl be emptied.</div>
    <div class="c-button-row">
      <PrimaryToggleButton
        v-model="mazeIngressing"
        class="o-primary-btn--maze"
        label="Ingress: "
      />
      <PrimaryButton
        @click="egross"
        :enabled="enoughLP && this.mazeAM.gt(0)"
        class="o-primary-btn--maze"
      >
        Egress
      </PrimaryButton>
    </div>
  </div>
</template>

<style scoped>
.l-maze-row {
  margin-top: 5rem;
}

.c-button-row {
  display: flex;
  justify-content: space-around;
  width: 100%;
}

.o-primary-btn--maze {
  width: 20rem;
  margin: 0 3rem;
  height: 5rem;
}
</style>