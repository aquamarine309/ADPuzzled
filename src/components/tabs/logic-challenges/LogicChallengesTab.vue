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