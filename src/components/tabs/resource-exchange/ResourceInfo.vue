<script>
export default {
  name: "ResourceInfo",
  props: {
    resource: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isUnlocked: false,
      exchanged: new Decimal(0),
      newExchanged: new Decimal(0),
      value: new Decimal(0),
      newValue: new Decimal(0),
      isAffordable: false,
      hasUnlocked: false,
      isPower: false
    };
  },
  computed: {
    requiredLevel() {
      return this.resource.requiredLevel;
    },
    classObject() {
      return {
        "c-resource-info": true,
        "c-resource-info--disabled": !this.isUnlocked
      };
    }
  },
  methods: {
    update() {
      this.isUnlocked = this.resource.isUnlocked;
      if (!this.isUnlocked) return;
      this.exchanged.copyFrom(this.resource.exchangedAmount);
      this.newExchanged.copyFrom(this.resource.newExchanged);
      this.isPower = this.resource.isPower;
      this.value = this.resource.value;
      this.newValue = this.resource.afterExchangeValue;
      this.isAffordable = this.resource.isAffordable;
    },
    formatEffect(value) {
      if (this.isPower) return formatPow(value, 2, 3);
      return formatX(value, 2, 2);
    }
  }
};
</script>

<template>
  <div :class="classObject">
    <div class="c-resource-info-title">
      <span v-if="isUnlocked">{{ resource.symbol }} {{ resource.name }} {{ resource.symbol }}</span>
      <span v-else>Locked</span>
    </div>
    <div
      v-if="isUnlocked"
      class="c-resource-info-values"
    >
      <span>Exchanged Amount: {{ format(exchanged, 2, 1) }} ➜ {{ format(newExchanged, 2, 1) }}</span>
      <span>Point {{ isPower ? "Power" : "Multiplier" }}: {{ formatEffect(value, 2, 2) }} ➜ {{ formatEffect(newValue, 2, 2) }}</span>
    </div>
    <div v-else>
      (Unlock at Exchange Level {{ formatInt(requiredLevel) }})
    </div>
  </div>
</template>