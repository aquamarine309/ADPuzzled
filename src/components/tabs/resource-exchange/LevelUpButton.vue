<script>
export default {
  name: "LevelUpButton",
  data() {
    return {
      isAffordable: false,
      cost: new Decimal(0),
      level: 0,
      bonusLevel: 0
    };
  },
  computed: {
    upgrade: () => ResourceExchangeUpgrade,
    btnClass() {
      return {
        "c-exchange-btn": true,
        "c-exchange-btn--disabled": !this.isAffordable
      };
    },
    config() {
      return this.upgrade.config;
    },
    nextLevel() {
      return Math.max(this.bonusLevel, player.logic.resourceExchange.level + 1);
    }
  },
  methods: {
    update() {
      this.isAffordable = this.upgrade.isAffordable;
      this.level = this.upgrade.level;
      this.cost.copyFrom(this.upgrade.cost);
      this.bonusLevel = Antiatom(1).effectOrDefault(0) + 1;
    },
    formatLevel(value) {
      if (value % 1 === 0) return formatInt(value);
      return format(value, 2, 1);
    }
  }
};
</script>

<template>
  <div
    :class="btnClass"
    @click="upgrade.purchase()"
  >
    <div>Level Up</div>
    <div>Cost: {{ format(cost, 2, 2) }} LP</div>
    <div>Exchange Lv. {{ formatLevel(level) }} ➜ {{ formatLevel(nextLevel) }}</div>
  </div>
</template>