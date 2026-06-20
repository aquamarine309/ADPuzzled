<script>
import ChallengeGrid from "../../ChallengeGrid";
import ChallengeTabHeader from "../../ChallengeTabHeader";

import LogicChallengeBox from "./LogicChallengeBox";

export default {
  name: "LogicChallengesTab",
  components: {
    ChallengeGrid,
    ChallengeTabHeader,
    LogicChallengeBox
  },
  data() {
    return {
      showAllChallenges: false
    };
  },
  computed: {
    challenges() {
      return LogicChallenges.all;
    },
    inf() {
      return Decimal.NUMBER_MAX_VALUE;
    }
  },
  methods: {
    update() {
      this.showAllChallenges = player.options.showAllChallenges;
    },
    isChallengeVisible(challenge) {
      return challenge.isUnlocked || (this.showAllChallenges && PlayerProgress.eternityUnlocked());
    }
  }
};
</script>

<template>
  <div class="l-challenges-tab">
    <div>Logic Challenges are similar to Normal Challenges: you need to reach a certain amount of Antimatter to complete them. The difference is that you can perform a normal Infinity upon reaching {{ format(inf, 2) }} Antimatter, but you cannot gain Infinity Points within Logic Challenges. Logic Challenges can be run simultaneously with Normal Challenges and Infinity Challenges. Once the requirements of any one of them are met, performing Infinity will complete the corresponding challenge.</div>
    <div>Logic Challenge 1 is unlocked by a Logic Upgrade. Each subsequent challenge is unlocked after completing the previous one. There are eight challenges in total. Starting from Logic Challenge 2, you need to Break Infinity first.</div>
    <ChallengeTabHeader />
    <ChallengeGrid
      v-slot="{ challenge }"
      :challenges="challenges"
      :is-challenge-visible="isChallengeVisible"
    >
      <LogicChallengeBox :challenge="challenge" />
    </ChallengeGrid>
  </div>
</template></script>