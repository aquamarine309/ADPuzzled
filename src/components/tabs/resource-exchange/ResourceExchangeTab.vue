<script>
import PrimaryButton from "../../PrimaryButton";

import SliderComponent from "../../SliderComponent";

import ExchangeButton from "./ExchangeButton";
import LevelUpButton from "./LevelUpButton";
import ResourceExchangeLayout from "./ResourceExchangeLayout";
import ResourceInfo from "./ResourceInfo";
import LogicUpgradeButton from "./LogicUpgradeButton";


export default {
  name: "ResourceExchangeTab",
  components: {
    ResourceExchangeLayout,
    ResourceInfo,
    ExchangeButton,
    LevelUpButton,
    SliderComponent,
    PrimaryButton,
    LogicUpgradeButton
  },
  data() {
    return {
      resourceId: 0,
      logicPoints: new Decimal(0),
      totalLogicPoints: new Decimal(0),
      multiplier: new Decimal(0)
    };
  },
  computed: {
    currentResource() {
      return ResourceExchange.all[this.resourceId];
    },
    upgrades: () => LogicUpgrades.all,
  },
  watch: {
    resourceId(value) {
      player.logic.resourceExchange.lastSelected = value;
    }
  },
  methods: {
    update() {
      this.resourceId = player.logic.resourceExchange.lastSelected;
      this.logicPoints = Currency.logicPoints.value;
      this.totalLogicPoints = GameCache.logicPoints.value;
      this.multiplier = ResourceExchangeUpgrade.effectValue;
    },
    handleToggle(index) {
      if (this.resourceId === index) return;
      this.resourceId = index;
      GameUI.update();
    },
    id(row, column) {
      return (row - 1) * 5 + column - 1;
    }
  }
};
</script>

<template>
  <div>
    <ResourceInfo :resource="currentResource" />
    <div class="c-resource-exchange-layout-container">
      <ResourceExchangeLayout @toggle="handleToggle" />
      <div class="c-resource-exchange-right-container">
        <div class="c-lp-text-row">
          You have <span class="c-lp-amount">{{ format(logicPoints, 2, 2) }}</span> Logic Points.
        </div>
        <div>({{ format(totalLogicPoints, 2, 2) }} LP in total)</div>
        <br>
        <div class="c-lp-text-row--small">
          Total Logic Points and Exchange Levels provide a <span class="c-lp-amount--small">{{ formatX(multiplier, 2, 2) }}</span> multiplier to your Antimatter Dimensions.
        </div>
        <div class="c-resource-exchange-buttons-container">
          <ExchangeButton :resource="currentResource" />
          <LevelUpButton />
        </div>
      </div>
    </div>
    <div
      v-for="row in 2"
      :key="row"
      class="l-logic-upgrade-grid__row"
    >
      <LogicUpgradeButton
        v-for="column in 5"
        :key="id(row, column)"
        :upgrade="upgrades[id(row, column)]"
      />
    </div>
  </div>
</template>