<script>
import InfinityDimensionRow from "./ClassicInfinityDimensionRow";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "ClassicInfinityDimensionsTab",
  components: {
    PrimaryButton,
    InfinityDimensionRow
  },
  data() {
    return {
      infinityPower: new Decimal(0),
      dimMultiplier: new Decimal(0),
      powerPerSecond: new Decimal(0),
      incomeType: "",
      isLC4Running: false,
      isEC8Running: false,
      EC8PurchasesLeft: 0,
      isEC9Running: false,
      isEnslavedRunning: false,
      isAnyAutobuyerUnlocked: false,
      conversionRate: 0,
      nextDimCapIncrease: 0,
      tesseractCost: new Decimal(0),
      totalDimCap: 0,
      canBuyTesseract: false,
      enslavedCompleted: false,
      boughtTesseracts: 0,
      extraTesseracts: 0,
      creditsClosed: false,
      showLockedDimCostNote: true,
    };
  },
  computed: {
    tesseractCountString() {
      const extra = this.extraTesseracts > 0 ? ` + ${format(this.extraTesseracts, 2, 2)}` : "";
      return `${formatInt(this.boughtTesseracts)}${extra}`;
    },
    formula() {
      if (this.isEC9Running) return `log2(x)${formatPow(4)}`;
      if (this.isLC4Running) return `lg(x)${formatPow(this.conversionRate, 1, 1)}`;
      return `x${formatPow(this.conversionRate, 2, 3)}`;
    }
  },
  methods: {
    update() {
      this.showLockedDimCostNote = !InfinityDimension(8).isUnlocked;
      this.isEC9Running = EternityChallenge(9).isRunning;
      this.infinityPower.copyFrom(Currency.infinityPower);
      this.conversionRate = InfinityDimensions.powerConversionRate;
      if (this.isEC9Running) {
        this.dimMultiplier.copyFrom(Decimal.pow(Math.max(this.infinityPower.log2(), 1), 4).max(1));
      } else if (this.isLC4Running) {
        this.dimMultiplier = new Decimal(LogicChallenge(4).effectValue);
      }  else {
        this.dimMultiplier.copyFrom(this.infinityPower.pow(this.conversionRate).max(1));
      }
      this.powerPerSecond.copyFrom(InfinityDimension(1).productionPerRealSecond);
      this.incomeType = EternityChallenge(7).isRunning ? "Seventh Dimensions" : "Infinity Power";
      this.isLC4Running = LogicChallenge(4).isRunning;
      this.isEC8Running = EternityChallenge(8).isRunning;
      if (this.isEC8Running) {
        this.EC8PurchasesLeft = player.eterc8ids;
      }
      this.isEnslavedRunning = Enslaved.isRunning;
      this.isAnyAutobuyerUnlocked = Autobuyer.infinityDimension(1).isUnlocked;
      this.nextDimCapIncrease = Tesseracts.nextTesseractIncrease;
      this.tesseractCost.copyFrom(Tesseracts.nextCost);
      this.totalDimCap = InfinityDimensions.totalDimCap;
      this.canBuyTesseract = Tesseracts.canBuyTesseract;
      this.enslavedCompleted = Enslaved.isCompleted;
      this.boughtTesseracts = Tesseracts.bought;
      this.extraTesseracts = Tesseracts.extra;
      this.creditsClosed = GameEnd.creditsEverClosed;
    },
    maxAll() {
      InfinityDimensions.buyMax();
    },
    toggleAllAutobuyers() {
      toggleAllInfDims();
    },
    buyTesseract() {
      Tesseracts.buyTesseract();
    }
  }
};
</script>

<template>
  <div class="l-infinity-dim-tab">
    <div class="c-subtab-option-container">
      <PrimaryButton
        v-if="!isEC8Running"
        class="o-primary-btn--subtab-option"
        @click="maxAll"
      >
        Max all
      </PrimaryButton>
      <PrimaryButton
        v-if="isAnyAutobuyerUnlocked && !isEC8Running"
        class="o-primary-btn--subtab-option"
        @click="toggleAllAutobuyers"
      >
        Toggle all autobuyers
      </PrimaryButton>
    </div>
    <div>
      <p>
        You have
        <span class="c-infinity-dim-description__accent">{{ format(infinityPower, 2, 1) }}</span>
        Infinity Power,
        <br>
        <span v-if="!isEC9Running">
          increased by
          <span class="c-infinity-dim-description__accent">{{ formula }}</span>
        </span>
        <span v-else>
          translated
        </span>
        to a
        <span class="c-infinity-dim-description__accent">{{ formatX(dimMultiplier, 2, 1) }}</span>
        multiplier on all
        <span v-if="isEC9Running">Time Dimensions due to Eternity Challenge 9.</span>
        <span v-else-if="isLC4Running">game speed die to Logic Challenge 4.</span>
        <span v-else>Antimatter Dimensions.</span>
      </p>
    </div>
    <div
      v-if="enslavedCompleted"
      class="l-infinity-dim-tab__enslaved-reward-container"
    >
      <button
        class="c-infinity-dim-tab__tesseract-button"
        :class="{
          'c-infinity-dim-tab__tesseract-button--disabled': !canBuyTesseract,
          'o-pelle-disabled-pointer': creditsClosed
        }"
        @click="buyTesseract"
      >
        <p>
          Buy a Tesseract ({{ tesseractCountString }})
        </p>
        <p>Increase Infinity Dimension caps by {{ format(nextDimCapIncrease, 2) }}</p>
        <p><b>Costs: {{ format(tesseractCost) }} IP</b></p>
      </button>
    </div>
    <div v-if="isEnslavedRunning">
      All Infinity Dimensions are limited to a single purchase.
    </div>
    <div v-else>
      All Infinity Dimensions except for the 8th are limited to a maximum of {{ format(totalDimCap, 2) }}
      purchases each.
    </div>
    <div>You are getting {{ format(powerPerSecond, 2, 0) }} {{ incomeType }} per second.</div>
    <b
      v-if="isEC8Running"
      class="l-infinity-dim-tab__ec8-purchases"
    >
      You have {{ quantifyInt("purchase", EC8PurchasesLeft) }} left within Eternity Challenge 8.
    </b>
    <div class="l-dimensions-container">
      <InfinityDimensionRow
        v-for="tier in 8"
        :key="tier"
        :tier="tier"
      />
    </div>
    <div v-if="showLockedDimCostNote">
      Hold shift to see the Infinity Point cost for locked Infinity Dimensions.
    </div>
  </div>
</template>
