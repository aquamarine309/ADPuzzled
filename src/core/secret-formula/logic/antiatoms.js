import { DC } from "@/core/constants";

export const antiatoms = [
  {
    id: 1,
    name: "hydrogen",
    symbol: "H",
    requirement: DC.D0,
    currency: () => Currency.antimatter,
    amountCost: x => Decimal.pow10((2 ** x + x * 0.05) * 195),
    levelCost: x => Decimal.pow10((5 * x + Math.pow(30, Math.sqrt(x))) * 280),
    effect: (amount, level, energy) => {
      const eff = Math.pow(Math.log2(1 + Math.pow(amount, 2) * Math.sqrt(Math.max(1, level))) * (0.125 * energy.add(1).log10() + 1), 0.85);
      if (eff >= 3) return 3 + (eff + Math.pow(1.5, eff - 6)) / 45;
      return eff;
    },
    formatEffect: value => format(value, 2, 3),
    description: "Provide Exchange Level a minimum of {value}",
    formatCost: value => `${format(value, 1)} AM`,
    milestones: [
      {
        id: 0,
        description: "Unlock 1st Logic Dimension. All Logic Upgrades are free.",
        requirement: 1
      },
      {
        id: 1,
        description: "Extra Bonus is always unlocked. You can switch extra bonus between you have unlocked.",
        requirement: 2,
      },
      {
        id: 2,
        description: "Unlock Antihydrogen Energy.",
        requirement: 3
      },
      {
        id: 3,
        description: "Unlock antihelium.",
        requirement: 5
      }
    ]
  }
]