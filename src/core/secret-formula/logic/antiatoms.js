import { DC } from "@/core/constants";

export const antiatoms = [
  {
    id: 1,
    name: "hydrogen",
    symbol: "H",
    requirement: DC.D0,
    currency: () => Currency.antimatter,
    amountCost: x => DC.E20000.pow(x * 3 + 2 ** (x - 6.365)),
    levelCost: x => DC.E100000.pow(1.5 * x ** 2 + 3 ** (x - 6)),
    effect: (amount, level) => Math.log(1 + 0.05 * Math.pow(amount, level + 1)),
    formatEffect: value => format(value, 2, 3),
    description: "Add {value} free exchange level",
    formatCost: value => `${format(value, 1)} AM`,
    milestones: [
      {
        id: 0,
        description: "Unlock 1st Logic Dimension. All Logic Upgrades are free.",
        requirement: 1
      },
      {
        id: 1,
        description: "You can switch extra bonus between you have unlocked.",
        requirement: 2
      },
      {
        id: 2,
        description: "Unlock antihelium",
        requirement: 5
      }
    ]
  }
]