<script>
import CostDisplay from "../../CostDisplay";
import DescriptionDisplay from "../../DescriptionDisplay";
import EffectDisplay from "../../EffectDisplay";
import HintText from "../../HintText";

export default {
  name: "LogicUpgradeButton",
  components: {
    DescriptionDisplay,
    EffectDisplay,
    CostDisplay,
    HintText
  },
  props: {
    upgrade: {
      type: Object,
      required: true
    },
    selecting: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      isAvailableForPurchase: false,
      canBeBought: false,
      isBought: false,
      isPossible: false,
      isSelected: false
    };
  },
  computed: {
    config() {
      return this.upgrade.config;
    },
    classObject() {
      return {
        "c-logic-upgrade-btn--bought": this.isBought,
        "c-logic-upgrade-btn--unavailable": !this.isBought && !this.canBeBought && this.isAvailableForPurchase,
        "c-logic-upgrade-btn--possible": !this.isAvailableForPurchase && this.isPossible,
        "c-logic-upgrade-btn--locked": !this.isAvailableForPurchase && !this.isPossible,
      };
    },
    requirementConfig() {
      return {
        description: this.config.requirement
      };
    },
    canLock() {
      return this.config.canLock && !(this.isAvailableForPurchase || this.isBought);
    },
  },
  watch: {
    isSelected(newValue) {
      if (newValue) {
        Autobuyer.logicUpgrade.data.selectedBits |= (1 << this.upgrade.id);
      } else {
        Autobuyer.logicUpgrade.data.selectedBits &= ~(1 << this.upgrade.id);
      }
    }
  },
  methods: {
    update() {
      const upgrade = this.upgrade;
      this.isAvailableForPurchase = upgrade.isAvailableForPurchase;
      this.canBeBought = upgrade.canBeBought;
      this.isBought = !upgrade.isRebuyable && upgrade.isBought;
      this.isPossible = upgrade.isPossible;
      this.isSelected = Autobuyer.logicUpgrade.purchaseSelected(upgrade.id);
    },
    handleClick() {
      if (this.selecting) {
        if (!this.isAvailableForPurchase && !this.isBought) return;
        this.isSelected = !this.isSelected;
      } else {
        this.upgrade.purchase();
      }
    }
  }
};
</script>

<template>
  <div class="l-spoon-btn-group">
    <button
      :class="classObject"
      class="l-logic-upgrade-btn c-logic-upgrade-btn"
      @click="handleClick()"
    >
      <HintText
        type="logicUpgrades"
        class="l-hint-text--logic-upgrade c-hint-text--logic-upgrade"
      >
        {{ config.name }}
      </HintText>
      <span>
        <DescriptionDisplay :config="config" />
        <template v-if="$viewModel.shiftDown === isAvailableForPurchase">
          <br>
          <DescriptionDisplay
            :config="requirementConfig"
            label="Requirement:"
            class="c-logic-upgrade-btn__requirement"
          />
        </template>
        <template v-else>
          <EffectDisplay
            :config="config"
            br
          />
          <CostDisplay
            v-if="!isBought"
            :config="config"
            br
            name="Logic Point"
          />
        </template>
      </span>
    </button>
    <div
      v-if="selecting && (isAvailableForPurchase || isBought)"
      class="o-requirement-lock"
    >
      <i
        v-if="isSelected"
        class="fas fa-gears"
      />
      <i
        v-else
        class="fas fa-mouse-pointer"
      />
    </div>
  </div>
</template>