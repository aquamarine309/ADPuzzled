import { DC } from "@/core/constants";

export const antiatoms = [
  {
    id: 1,
    name: "hydrogen",
    requirement: DC.D0,
    currency: () => Currency.antimatter,
    amountCost: x => DC.E60000.times(DC.E20000.pow(x + 2 ** (x - 6))),
    levelCost: x => DC.E100000.pow(x ** 2 + 3 ** (x - 6)),
    effect: (amount, level) => 1 + 0.02 * Math.pow(amount, level + 1),
    formatEffect: value => formatPow(value, 2, 2),
    description: "Antimatter to Logic Point multiplier {value}",
    formatCost: value => `${format(value, 1)} AM`,
    milestones: [
      {
        id: 0,
        description: "Unlock Logic Dimensions.",
        requirement: 1
      }
    ]
  }
]