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
      isAffordable: false
    }
  },
  methods: {
    update() {
      this.cost = this.item.cost;
      this.isAffordable = this.item.isAffordable;
    }
  }
}
</script>

<template>
  <div class="l-meaver-item-container">
    <div class="c-meaver-item-file">
      <div>// {{ item.config.file }}.js</div>
      <div class="c-modify-cost-info">
        <PrimaryButton
          :enabled="isAffordable"
          class="o-primary-btn--save-modification"
        >
          Save
        </PrimaryButton>
        <span>Cost: {{ quantify("Fragment", cost, 2) }}</span>
      </div>
    </div>
    <CommandPreview :item="item" />
  </div>
</template>

<style scoped>
.l-meaver-item-container {
  display: flex;
  flex-direction: column;
  padding: 3rem;
  margin: 1.2rem 1rem;
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
  background: #243562;
  border-top-left-radius: var(--var-border-radius, 0.5rem);
  border-top-right-radius: var(--var-border-radius, 0.5rem);
  position: relative;
}

.c-modify-cost-info {
  margin: 0 3rem;
}

.o-primary-btn--save-modification {
  margin: 0 0.6rem;
}
</style>