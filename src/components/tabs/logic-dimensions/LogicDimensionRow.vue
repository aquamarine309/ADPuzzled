<script>
import GenericDimensionRowText from "@/components/GenericDimensionRowText";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "LogicDimensionRow",
  components: {
    GenericDimensionRowText,
    PrimaryButton
  },
  props: {
    tier: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      amount: new Decimal(0),
      bought: 0,
      multiplier: new Decimal(0),
      rate: new Decimal(0),
      cost: 0
    }
  },
  computed: {
    dimension() {
      return LogicDimension(this.tier);
    },
    antiatom() {
      return this.dimension.antiatom;
    },
    symbol() {
      return this.antiatom.symbol;
    },
    name() {
      return `${this.dimension.displayNameShort} Logic Dimension`;
    }
  },
  methods: {
    update() {
      const dim = this.dimension;
      this.amount.copyFrom(dim.amount);
      this.bought = dim.bought;
      this.multiplier.copyFrom(dim.multiplier);
      this.rate.copyFrom(dim.rateOfChange);
      this.cost = dim.cost;
    }
  }
}
</script>

<template>
  <div>
    <GenericDimensionRowText
      :tier="tier"
      :name="name"
      :amount-text="format(amount, 2)"
      :multiplier-text="format(multiplier, 2, 3)"
      :rate="rate"
    />
    <PrimaryButton>
      Cost: {{ format(cost, 2) }} <sub>-{{ tier }}</sub>{{ symbol }}
    </PrimaryButton>
  </div>
</template>

<style scoped>

</style>