const tab = "&nbsp;&nbsp;";
const K = x => `#keyword(${x})`;
const I = x => `#identity(${x})`;
const S = x => `#string(${x})`;
const F = x => `#function(${x})`;

export const mechanicMeaver = {
  mechanics: {
    allowNC: {
      id: "allowNC",
      cost: 1,
      code: state => `${K("if")} (${state ? "!" : ""}${I("PlayerProgress")}.${I("eternityUnlocked")}()) {<br>
      ${tab}${I("Modal")}.${I("message")}.${F("show")}(${S("\"The Challenge is disabled.\"")});<br>
      ${tab}${K("return")};<br>}`,
      type: Boolean,
      comment: "Normal Challenge Control",
      file: "normal-challenges",
      formatEffect: state => state ? "Can Start Challenge" : "Cannot Start Challenge"
    }
  }
};