<script>
import AntiatomBox from "./AntiatomBox";

export default {
  name: "AntiatomsTab",
  components: {
    AntiatomBox
  },
  computed: {
    antiatoms() {
      return Antiatoms.all;
    }
  }
}
</script>

<template>
  <div>
    <div>
      Each Antiatom unlocks a <b>Logic Dimension</b> (LD) when first upgraded to excited state.
      <br>
      Spend Antiatoms to buy corresponding LD, which generate <b>Axiom</b> or lower LD.
      <br>
      Axiom provides a global multiplier to Logic Point production.
    </div>
    <div>
      <AntiatomBox
        v-for="antiatom in antiatoms"
        :key="antiatom.id"
        :antiatom="antiatom"
      />
    </div>
  </div>
</template>

<style scoped>

</style>