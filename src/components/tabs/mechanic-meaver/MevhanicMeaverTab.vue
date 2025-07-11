<script>
import MeaverItem from "./MeaverItem";
import LogicFragmentContainer from "./LogicFragmentContainer";
import DebugConsoleContainer from "./DebugConsoleContainer";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "MevhanicMeaverTab",
  components: {
    MeaverItem,
    LogicFragmentContainer,
    DebugConsoleContainer,
    PrimaryButton
  },
  computed: {
    mechanics: () => MechanicMeaver.mechanics
  },
  methods: {
    showMeaverHowTo() {
      ui.view.h2pForcedTab = GameDatabase.h2p.tabs.filter(tab => tab.name === "Mechanic Meaver")[0];
      Modal.h2p.show();
    },
  }
}
</script>

<template>
  <div class="l-meaver-tab">
    <PrimaryButton
      class="o-primary-btn--subtab-option"
      @click="showMeaverHowTo()"
    >
      Click for Mechanic Meaver info
    </PrimaryButton>
    <div class="c-meaver-title">[Logic Fragments]</div>
    <LogicFragmentContainer />
    <div class="c-meaver-title">[Mechanics]</div>
    <MeaverItem
      v-for="item of mechanics.all"
      :key="item.id"
      :item="item"
    />
    <div class="c-meaver-title">[Formulas]</div>
    <div><i class="fas fa-lock" /> How about we explore the area ahead of us later?</div>
    <div class="c-meaver-title">[Debug Console]</div>
    <DebugConsoleContainer />
  </div>
</template>

<style scoped>
.c-meaver-title {
  width: 100%;
  padding: 0.5rem 6rem;
  margin: 1rem;
  background: linear-gradient(to right, rgba(128, 128, 128, 0.3), rgba(128, 128, 128, 0));
  position: relative;
  height: 5rem;
  font-size: 2rem;
  font-weight: bold;
  text-align: left;
  color: white;
  display: flex;
  align-items: center;
  border-radius: var(--var-border-radius, 0.5rem);
}

.c-meaver-title::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 1.3rem;
  height: 100%;
  background: var(--color-logic);
  border-radius: var(--var-border-radius, 0.5rem);
}
</style>