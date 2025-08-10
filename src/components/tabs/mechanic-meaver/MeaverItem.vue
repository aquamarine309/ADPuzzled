<script>
import CommandPreview from "./CommandPreview";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "MeaverItem",
  components: {
    CommandPreview,
    PrimaryButton
  },
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      cost: 0,
      isAffordable: false,
      isExpanded: false
    }
  },
  methods: {
    update() {
      this.cost = this.item.cost;
      this.isAffordable = this.item.isAffordable;
    },
    modify() {
      this.item.modify();
    }
  }
}
</script>

<template>
  <div class="l-meaver-item-container">
    <div
      class="c-meaver-item-file"
      @click="isExpanded = !isExpanded"
    >
      <div>// {{ item.config.file }}</div>
      <div class="c-modify-cost-info">
        <span>Cost: {{ quantify("Fragment", cost, 2) }}</span>
        <span v-if="cost < 0">(50% less)</span>
        <PrimaryButton
          class="o-primary-btn--meaver"
          @click.stop="modify"
        >
          Save
        </PrimaryButton>
        <span class="c-expand-btn">
          <i
            class="far"
            :class="isExpanded ? 'fa-plus-square' : 'fa-minus-square'"
          />
        </span>
      </div>
    </div>
    <CommandPreview
      v-if="isExpanded"
      :item="item"
    />
  </div>
</template>

<style scoped>
.l-meaver-item-container {
  display: flex;
  flex-direction: column;
  padding: 0 3rem;
  margin: 4.2rem 1rem;
  border-radius: var(--var-border-radius, 0.5rem);
}

.c-meaver-item-file {
  width: 100%;
  height: 5rem;
  text-align: left;
  padding: 0 3rem;
  color: #5692d2;
  font-size: 1.3rem;
  display: flex;
  align-items: center;
  background: var(--color-meaver-deep);
  border-top-left-radius: var(--var-border-radius, 0.5rem);
  border-top-right-radius: var(--var-border-radius, 0.5rem);
  position: relative;
  cursor: pointer;
}

.c-modify-cost-info {
  margin: 0 3rem;
  position: absolute;
  right: 0;
}

.c-expand-btn {
  margin-left: 2rem;
  font-size: 1.4rem;
}
</style>