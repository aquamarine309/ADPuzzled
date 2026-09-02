<script>
import HintText from "../../HintText";

export default {
  name: "ResourceCircleNode",
  components: {
    HintText
  },
  props: {
    resource: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isUnlocked: false,
      isOpen: false,
      ecRunning: false
    };
  },
  computed: {
    classObject() {
      return {
        "o-resource-circle-node": true,
        "o-resource-circle-node--locked": !this.isUnlocked,
        "o-resource-circle-node--open": this.isUnlocked && this.isOpen,
        "o-resource-circle-node--locked-open": !this.isUnlocked && this.isOpen,
        "o-resource-circle-node--ec": this.isUnlocked && this.ecRunning,
        "o-resource-circle-node--open__ec": this.isUnlocked && this.isOpen && this.ecRunning
      };
    },
    displayName() {
      return this.resource.shortName ?? this.resource.name;
    }
  },
  methods: {
    update() {
      this.isUnlocked = this.resource.isUnlocked;
      this.isOpen = this.resource.id === player.logic.resourceExchange.lastSelected;
      this.ecRunning = EternityChallenge.isRunning;
    }
  }
};
</script>

<template>
  <div :class="classObject">
    <HintText
      v-if="isUnlocked"
      type="resourceExchange"
      class="o-hint-text--resource-exchange l-hint-text--resource-exchange"
    >
      {{ displayName }}
    </HintText>
    {{ resource.symbol }}
  </div>
</template>