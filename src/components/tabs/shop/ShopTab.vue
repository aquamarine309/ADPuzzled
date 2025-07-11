<script>
import PrimaryButton from "@/components/PrimaryButton";
import ShopButton from "./ShopButton";

export default {
  name: "ShopTab",
  components: {
    ShopButton,
    PrimaryButton,
  },
  data() {
    return {
      IAPsEnabled: false,
      creditsClosed: false,
      hasDLC: false,
      gotSTD: false,
      extraBonusUnlocked: false,
      extraBonusTimeLeft: 0,
      isPermanent: false
    };
  },
  computed: {
    isDoomed: () => Pelle.isDoomed,
    purchases() {
      return ShopPurchase.all;
    },
    enableText() {
      return `In-app Purchases: ${this.IAPsEnabled ? "Enabled" : "Disabled"}`;
    },
    leftTime() {
      return TimeSpan.fromMilliseconds(this.extraBonusTimeLeft).toStringShort();
    },
    hasBonus() {
      return this.extraBonusTimeLeft > 0;
    },
  },
  methods: {
    update() {
      this.IAPsEnabled = player.IAP.enabled;
      this.creditsClosed = GameEnd.creditsEverClosed;
      this.hasDLC = player.hasDLC;
      this.gotSTD = player.gotSTD;
      this.extraBonusUnlocked = ExtraBonus.isUnlocked;
      if (this.extraBonusUnlocked) {
        if (this.isDoomed) {
          this.description = wordShift.wordCycle(["Destroyed", "Annihilated", "Nullified"]);
          return;
        }
        this.isPermanent = ExtraBonus.isPermanent;
        this.extraBonusTimeLeft = player.extraBonusTimeLeft;
        if (!this.hasBonus) {
          this.description = "Click here to receive free bonus!";
        } else {
          this.description = ExtraBonus.current.description;
        }
      }
    },
    showStore() {
      if (this.creditsClosed) return;
      SecretAchievement(33).unlock();
      Modal.shop.show();
    },
    respec() {
      if (this.creditsClosed) return;
      ShopPurchaseData.respecRequest();
    },
    toggleEnable() {
      player.IAP.enabled = !player.IAP.enabled;
    },
    respecClass() {
      return {
        "o-primary-btn--subtab-option": true,
        "o-pelle-disabled-pointer": this.creditsClosed
      };
    },
    getBonus() {
      if (this.hasBonus || this.isDoomed) return false;
      player.extraBonusTimeLeft += 3.6e6 * (5 + MechanicMeaver.mechanics.keepExtra.effectValue);
      GameUI.update();
    }
  },
};
</script>

<template>
  <div class="tab shop">
    <div class="c-shop-disclaimer">
      Not a Disclaimer: These are required to progress in the game, they are not for supporting the developer.
      The game is balanced with the use of some microtransactions.
    </div>
    <div class="c-subtab-option-container">
      <PrimaryButton
        class="o-primary-btn--subtab-option"
        :class="{ 'o-pelle-disabled-pointer': creditsClosed }"
        label="Disable in-app-purchases:"
        @click="toggleEnable()"
      >
        {{ enableText }}
      </PrimaryButton>
      <PrimaryButton
        :class="respecClass()"
        @click="respec()"
      >
        Respec Shop
      </PrimaryButton>
    </div>
    <button
      v-if="extraBonusUnlocked"
      class="extra-bonus-btn"
      @click="getBonus"
    >
      <div v-if="isDoomed">
        Extra Bonus has been
        <b class="extra-bonus-destoryed">
          {{ description }}
        </b>
      </div>
      <div v-else>
        {{ description }}
      </div>
      <div v-if="hasBonus">
        <span v-if="isPermanent">Permanent</span>
        <span v-else>{{ leftTime }} left</span>
      </div>
    </button>
    <div class="c-shop-header">
      <span>You have {{ gotSTD && !hasDLC ? "1" : "0" }}</span>
      <img
        src="images/std_coin.png"
        class="c-shop-header__img"
      >
      <button
        class="o-shop-button-button"
        @click="showStore()"
      >
        Buy More
      </button>
    </div>
    Note: All numbers on this page are intentionally unaffected by your notation settings
    <div class="l-shop-buttons-container">
      <ShopButton
        v-for="purchase in purchases"
        :key="purchase.key"
        :purchase="purchase"
      />
    </div>
  </div>
</template>

<style scoped>
.shop {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: var(--color-text);
}

.c-shop-disclaimer {
  width: 80%;
  max-width: 100rem;
  font-size: 1.8rem;
  font-weight: bold;
  color: black;
  background: var(--color-bad);
  border: var(--var-border-width, 0.2rem) solid black;
  border-radius: var(--var-border-radius, 1rem);
  margin-top: 0.8rem;
}

.t-s1 .c-shop-disclaimer,
.t-s6 .c-shop-disclaimer,
.t-s10 .c-shop-disclaimer {
  color: var(--color-bad);
  background: black;
  border-color: var(--color-bad);
}

.c-login-info {
  font-size: 1.5rem;
}

.c-shop-header {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  margin: 1rem 0;
}

.c-shop-header__img {
  height: 40px;
  margin: 0 1rem;
}

.o-shop-button-button {
  display: flex;
  align-items: center;
  font-family: Typewriter;
  background: turquoise;
  border: none;
  border-radius: var(--var-border-radius, 0.5rem);
  margin: auto;
  margin-top: 1rem;
  padding: 0.5rem 2rem;
  cursor: pointer;
}

.o-shop-button-button--disabled {
  background: rgb(150, 150, 150);
  cursor: default;
}

.l-shop-buttons-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  width: 93rem;
  margin: auto;
}

.c-shop-header .o-shop-button-button {
  margin: 0;
}
</style>
