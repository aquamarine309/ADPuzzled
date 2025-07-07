<script>
import PrimaryToggleButton from "@/components/PrimaryToggleButton";

function addHighlight(command) {
  return command.replace(/#(.+?)\((.+?)\)/g, "<span class='c-code-$1'>$2</span>");
}

export default {
  name: "CommandPreview",
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  components: {
    PrimaryToggleButton
  },
  data() {
    return {
      value: new Decimal(),
      valueToModify: new Decimal(),
      current: "",
      next: ""
    }
  },
  computed: {
    code() {
      return addHighlight(this.item.config.code(this.valueToModify));
    },
    title() {
      return this.item.config.comment.toUpperCase();
    },
    isBoolean() {
      return this.item.type === Boolean;
    }
  },
  watch: {
    valueToModify(value) {
      this.item.valueToModify = value;
      GameUI.update();
    }
  },
  methods: {
    update() {
      if (this.value.type === Decimal) {
        this.value.copyFrom(this.item.value);
        this.valueToModify.copyFrom(this.item.valueToModify);
      } else {
        this.value = this.item.value;
        this.valueToModify = this.item.valueToModify
      }
      this.current = this.item.config.formatEffect(this.value);
      this.next = this.item.config.formatEffect(this.valueToModify);
    }
  }
}
</script>

<template>
  <div class="l-meaver-code-container">
    <div class="c-meaver-item-subtitle">{{ title }}</div>
    <div class="c-meaver-code">
      <span v-html="code" />
    </div>
    <div class="c-meaver-item-effect">
      Currently: {{ current }}
      <span v-if="next !== current">
        | Modified: {{ next }}</span>
      </div>
    <div v-if="isBoolean">
      State: <PrimaryToggleButton v-model="valueToModify" />
      <span v-if="value !== valueToModify">
      (You should click on the "Save" button to modify)
    </span>
    </div>
  </div>
</template>

<style>
.l-meaver-code-container {
  padding: 0.5rem 1rem;
  background: #122135;
  text-align: left;
  border-bottom-left-radius: var(--var-border-radius, 0.5rem);
  border-bottom-left-radius: var(--var-border-radius, 0.5rem);
  color: #c8c8c8;
}

.c-meaver-item-subtitle {
  color: #4884db;
  font-size: 1.5rem;
  margin: 1rem;
}

.c-meaver-code {
  border: 0.1rem solid #30363d;
  border-radius: var(--var-border-radius, 0.3rem);
  background: #244265;
  margin: 0 0.5rem;
  padding: 0.5rem 1rem;
  font-weight: bold;
}

.c-meaver-item-effect {
  color: var(--color-logic);
  font-size: 1.3rem;
  margin: 0.4rem;
}
</style>