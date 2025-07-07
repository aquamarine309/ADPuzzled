<script>
import MeaverItem from "./MeaverItem";

export default {
  name: "MevhanicMeaverTab",
  components: {
    MeaverItem
  },
  computed: {
    mechanics: () => MechanicMeaver.mechanics
  }
}
</script>

<template>
  <div>
    <div class="c-meaver-title">[Mechanics]</div>
    <MeaverItem
      v-for="item of mechanics.all"
      :key="item.id"
      :item="item"
    />
    <div class="c-meaver-title">[Formulas]</div>
    <div>Coming Soon</div>
    <div class="c-meaver-title">[Player Data]</div>
    <div>Coming Soon</div>
    <div class="c-meaver-title">[Debug Console]</div>
    <div>Coming Soon</div>
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