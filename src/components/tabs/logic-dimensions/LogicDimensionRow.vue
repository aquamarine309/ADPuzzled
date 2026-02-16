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
      cost: 0,
      isUnlocked: false,
      canRespec: false,
      isAffordable: false
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
      return `${this.dimension.shortDisplayName} Logic Dimension`;
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
      this.isUnlocked = dim.isUnlocked;
      this.isAffordable = dim.isAffordable;
      this.canRespec = dim.canRespec;
    },
    buyOne() {
      this.dimension.buyOne();
    },
    respec() {
      this.dimension.respec();
    }
  }
}
</script>

<template>
  <div
    class="c-dimension-row l-dimension-row-logic-dim l-dimension-single-row"
    :class="{ 'c-dim-row--not-reached': !isUnlocked }"
  >
    <GenericDimensionRowText
      :tier="tier"
      :name="name"
      :amount-text="format(amount, 2)"
      :multiplier-text="formatX(multiplier, 2, 3)"
      :rate="rate"
    />
    <div class="l-dim-row-multi-button-container c-modern-dim-tooltip-container">
      <PrimaryButton
        class="o-primary-btn--buy-td o-primary-btn o-primary-btn--new o-primary-btn--buy-dim"
        :enabled="isAffordable"
        @click="buyOne"
      >
        Cost: {{ format(cost, 2) }} <sub>-{{ tier }}</sub>{{ symbol }}
      </PrimaryButton>
      <PrimaryButton
        class="o-primary-btn--buy-td o-primary-btn o-primary-btn--new o-primary-btn--buy-dim"
        :enabled="canRespec"
        @click="respec"
      >
        Respec
      </PrimaryButton>
    </div>
  </div>
</template>

<style scoped>

</style>