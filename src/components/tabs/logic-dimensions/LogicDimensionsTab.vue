<script>
import LogicDimensionRow from "./LogicDimensionRow";

export default {
  name: "LogicDimensionsTab",
  components: {
    LogicDimensionRow
  },
  data() {
    return {
      axioms: new Decimal()
    }
  },
  computed: {
    
  },
  methods: {
    update() {
      this.axioms.copyFrom(Currency.axioms);
    }
  }
}
</script>

<template>
  <div>
    <div>You have {{ format(axioms, 2, 2) }} Axioms.</div>
    <div>
      <LogicDimensionRow
        v-for="tier in 1"
        :key="tier"
        :tier="tier"
      />
    </div>
  </div>
</template>

<style scoped>

</style>