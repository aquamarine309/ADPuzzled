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
      multiplier: new Decimal(0),
      rateUnlocked: false,
      sliderInterval: 1,
      showIPMultiplier: false,
      ipMult: new Decimal(0),
    };
  },
  computed: {
    currentResource() {
      return ResourceExchange.all[this.resourceId];
    },
    upgrades: () => LogicUpgrades.all,
    sliderProps() {
      return {
        min: 1,
        max: 100,
        interval: 1,
        width: "100%",
        tooltip: false,
        "dot-class": "c-exchange__slider-handle",
        "bg-class": "c-exchange__slider-bg",
        "process-class": "c-exchange__slider-process"
      };
    }
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
      this.rateUnlocked = LogicChallenge(2).isCompleted;
      this.sliderInterval = this.currentResource.exchangeRate * 100;
      this.showIPMultiplier = LogicChallenge(7).reward.canBeApplied;
      if (this.showIPMultiplier) {
        this.ipMult = LogicChallenge(7).reward.effectValue;
      }
    },
    handleToggle(index) {
      if (this.resourceId === index) return;
      this.resourceId = index;
      GameUI.update();
    },
    id(row, column) {
      return (row - 1) * 5 + column - 1;
    },
    showLogicHowTo() {
      ui.view.h2pForcedTab = GameDatabase.h2p.tabs.filter(tab => tab.name === "Logic")[0];
      Modal.h2p.show();
    },
    adjustSliderValue(value) {
      this.sliderInterval = value;
      this.currentResource.exchangeRate = this.sliderInterval / 100;
    },
  }
};
</script>

<template>
  <div>
    <div class="c-subtab-option-container">
      <PrimaryButton
        class="o-primary-btn--subtab-option"
        @click="showLogicHowTo()"
      >
        Click for Logic info
      </PrimaryButton>
    </div>
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
        <div
          v-if="showIPMultiplier"
          class="c-lp-text-row--small"
        >
          IP <span class="c-lp-amount--small">{{ formatX(ipMult, 2, 2) }}</span> due to the reward of Logic Challenge 7.
        </div>
        <div
          v-if="currentResource.isUnlocked && rateUnlocked"
          class="c-exchange-rate-conatiner"
        >
          <div>
            <b>Exchange rate: {{ formatInt(sliderInterval) }}%</b>
            <SliderComponent
              lass="o-primary-btn--slider__slider"
              v-bind="sliderProps"
              :value="sliderInterval"
              @input="adjustSliderValue($event)"
            />
          </div>
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