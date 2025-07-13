<script>
import PrimaryButton from "@/components/PrimaryButton";
import PrimaryToggleButton from "@/components/PrimaryToggleButton";
import Prism from "prismjs";
import 'prismjs/components/prism-javascript';

export default {
  name: "CommandPreview",
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  components: {
    PrimaryButton,
    PrimaryToggleButton
  },
  data() {
    return {
      value: new Decimal(),
      valueToModify: new Decimal(),
      tutorial: false
    }
  },
  computed: {
    code() {
      if (!this.isDecimal && (this.value instanceof Decimal)) return "// Loading";
      return this.item.config.code(this.effect).trim();
    },
    name() {
      return this.item.name;
    },
    isBoolean() {
      return this.item.type === MEAVER_TYPE.BOOLEAN;
    },
    isEnum() {
      return this.item.type === MEAVER_TYPE.ENUM;
    },
    isDecimal() {
      return this.item.type === MEAVER_TYPE.DECIMAL;
    },
    enumLabels() {
      return this.item.config.labels;
    },
    description() {
      return this.item.config.description;
    },
    effect() {
      return this.item.effectOnValue(this.valueToModify);
    },
    current() {
      return this.item.config.formatEffect(this.item.effectOnValue(this.value));
    },
    modified() {
      return this.item.config.formatEffect(this.effect);
    }
  },
  watch: {
    valueToModify(value) {
      this.item.valueToModify = value;
      GameUI.update();
    },
    code() {
      this.$nextTick(() => {
        this.highlightCode();
      });
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.highlightCode();
    });
  },
  methods: {
    update() {
      if (this.value.type === MEAVER_TYPE.DECIMAL) {
        this.value.copyFrom(this.item.value);
        this.valueToModify.copyFrom(this.item.valueToModify);
      } else {
        this.value = this.item.value;
        this.valueToModify = this.item.valueToModify
      }
      this.tutorial = this.item.id === "allowNC" && this.value !== this.valueToModify;
    },
    highlightCode() {
      if (this.$refs.codeBlock) {
        this.$refs.codeBlock.innerHTML = this.code;
        Prism.highlightElement(this.$refs.codeBlock);
      }
    }
  }
}
</script>

<template>
  <div class="l-meaver-code-container">
    <div>
      <div>
        <div class="c-meaver-item-subtitle">{{ name }}</div>
        <div>{{ description }}</div>
        <div class="c-meaver-item-effect">
          <span v-if="modified === current">Current: {{ current }}</span>
          <span v-else>Modified: {{ modified }}</span>
        </div>
      </div>
      <div>
        <div v-if="isBoolean">
          Toggle:
          <PrimaryToggleButton
            v-model="valueToModify"
            class="o-primary-btn--meaver"
          />
        </div>
        <div v-else-if="isEnum">
          Choose one:
          <PrimaryButton
            class="o-primary-btn--meaver o-primary-btn-enum"
            v-for="(label, idx) of enumLabels"
            :key="idx"
            @click="valueToModify = idx"
          >
            {{ label }}
          </PrimaryButton>
        </div>
        <div v-if="tutorial">
          (You should click on the "Save" button to modify)
        </div>
      </div>
    </div>
    <div>
      <pre class="language-javascript"><code ref="codeBlock">{{ code }}</code></pre>
    </div>
  </div>
</template>

<style>
.l-meaver-code-container {
  padding: 0.5rem 1rem;
  background: var(--color-meaver-background);
  text-align: left;
  border-bottom-left-radius: var(--var-border-radius, 0.5rem);
  border-bottom-right-radius: var(--var-border-radius, 0.5rem);
  color: var(--color-code-text);
  display: flex;
  flex-direction: row;
}

.l-meaver-code-container > div {
  display: flex;
  flex-direction: column;
  flex: 1;
  margin: 0 2rem;
  align-content: space-between;
}

.c-meaver-item-subtitle {
  color: #4884db;
  font-size: 1.8rem;
}

.c-meaver-item-effect {
  color: var(--color-logic);
  font-size: 1.3rem;
  margin: 0.4rem;
}

.o-primary-btn-enum {
  margin: 0.6rem;
}
</style>