export type PuzzleId = "gutder" | "vault" | "cipher" | "sugar" | "diagnosis" | "elements";

export type PuzzleMeta = {
  id: PuzzleId;
  level: 1 | 2 | 3;
  title: string;
  brief: string;
  hints: [string, string, string];
  letter: string;
  solvedLine: string;
};

export const LEVELS = {
  1: {
    name: "The Gut of Gaia",
    tagline: "All disease begins in the gut. Including the planet's.",
    villain: "Baron Seed Oil has locked Gaia's microbiome in a vault and is feeding it biscuits. Disgusting.",
    color: "#2bd99f",
    emoji: "🦠",
  },
  2: {
    name: "The Sugar Syndicate's Power Plant",
    tagline: "Lord Glucose Spike has hijacked the planet's energy grid.",
    villain: "\"Every meal a rollercoaster! Every afternoon a crash! MWAHAHA!\" — Lord Glucose Spike 🍩",
    color: "#ff8fb1",
    emoji: "⚡",
  },
  3: {
    name: "The Root of All Things",
    tagline: "Symptoms are just messengers. Find the root, heal the whole.",
    villain: "Count Cortisol has scrambled the five elements. The planet hasn't slept in 200 years.",
    color: "#f7b518",
    emoji: "🌳",
  },
} as const;

export const PUZZLES: PuzzleMeta[] = [
  {
    id: "gutder",
    level: 1,
    title: "Gutder: Find Your Microbiome's Match",
    brief:
      "Gaia's gut bugs are starving and they've joined a dating app. Swipe right 💚 on foods that feed the good microbes. Swipe left ❌ to send the imposters back to the Sugar Syndicate. Careful: some villains are in disguise.",
    hints: [
      "Ask two questions: would your great-grandmother recognise it as food? And does it give the bugs something to ferment?",
      "Watch out for marketing disguises. 'Natural', 'digestive' and 'zero sugar' are label words, not microbiome words.",
      "The imposters: packaged juice, 'digestive' biscuits, antibiotics for a viral cold, diet soda and the reused-oil samosa. Everything else feeds the bugs.",
    ],
    letter: "V",
    solvedLine: "Microbiome diversity restored. Gaia just burped… and it smelled like kombucha.",
  },
  {
    id: "vault",
    level: 1,
    title: "The Microbiome Vault",
    brief:
      "The good bugs are locked behind Baron Seed Oil's vault. The 4-digit code is made of numbers every nutritionist knows by heart. Match each symbol on the vault door to its riddle.",
    hints: [
      "Each dial is a single digit. The symbols on the door (🛡️ ☀️ 🧬 🅱️) set the order. Solve each riddle on its own.",
      "🛡️ About 70% of the immune system lives in the gut, so the digit is 7. ☀️ The fat-soluble squad is A, D, E and K.",
      "Essential amino acids: 9. B vitamins: B1, B2, B3, B5, B6, B7, B9, B12, which makes 8. The code is 7-4-9-8.",
    ],
    letter: "H",
    solvedLine: "VAULT OPEN! Trillions of good bacteria just walked out singing. Baron Seed Oil is furious.",
  },
  {
    id: "cipher",
    level: 2,
    title: "The Power Plant Cipher",
    brief:
      "Lord Glucose Spike encrypted the name of the planet's true power source. Spin the cipher wheel until the gibberish turns into English, then answer the riddle it reveals.",
    hints: [
      "Turn the inner wheel (drag it or use the arrows) and watch the message. The right shift is a number you used in the vault…",
      "The shift is 9, the number of essential amino acids. Read the riddle once it makes sense.",
      "Powerhouse of the cell, once a free-living bacterium, inherited only from your mother: MITOCHONDRIA. (Mito is blushing.)",
    ],
    letter: "E",
    solvedLine: "Mitochondria back online! Planetary ATP production up 4,000%. Mito is crying happy tears.",
  },
  {
    id: "sugar",
    level: 2,
    title: "Flatten the Curve (the Glucose One)",
    brief:
      "Lord Glucose Spike is riding the planet's blood sugar like a rollercoaster. The plate is the same, but the order changes everything. Arrange the meal so the glucose peak stays under 120 mg/dL.",
    hints: [
      "Order matters more than you'd think. What would you eat first to lay down a 'mesh' in the gut?",
      "Fibre first, then protein and fat, carbs last. And don't sit down straight after eating.",
      "🥗 Fibre → 🍳 Protein & fat → 🍚 Carbs → 🚶‍♀️ 10-minute walk.",
    ],
    letter: "T",
    solvedLine: "Curve flattened! Lord Glucose Spike fell off his rollercoaster and landed in a salad.",
  },
  {
    id: "diagnosis",
    level: 3,
    title: "Functional Medicine for a Planet",
    brief:
      "Gaia is the patient. Every planetary symptom has a twin inside the human body. Match each of Earth's symptoms to its root-cause twin, and the treatment plan writes itself.",
    hints: [
      "Treat the planet like a client. Ask: what's the equivalent system in the body?",
      "Soil is the planet's gut. Wildfires are inflammation. Plastic is toxic load.",
      "Soil ↔ dysbiosis · Fires ↔ inflammation · Plastic ↔ toxic overload · Monoculture ↔ same 5 foods · Lights ↔ circadian disruption · Smog ↔ oxidative stress.",
    ],
    letter: "I",
    solvedLine: "Root causes identified. Gaia's case file now reads: 'Highly reversible.'",
  },
  {
    id: "elements",
    level: 3,
    title: "The Panch Mahabhuta Sequence",
    brief:
      "Count Cortisol scrambled the five great elements, and Gaia's rhythm is broken. Watch the elements glow, then play the sequence back. Three rounds to restore the planet's rhythm.",
    hints: [
      "Say each one out loud as it glows ('Earth, Fire, Water…'). Words stick better than colours.",
      "Slow-motion mode is on: replays are slower now and labelled. Press Replay.",
      "Mito wrote the sequence down for you; it's under the pads. (Don't tell Count Cortisol.)",
    ],
    letter: "R",
    solvedLine: "Earth, Water, Fire, Air and Space are back in harmony. Gaia slept 8 hours for the first time since 1820.",
  },
];

export const LETTERS = PUZZLES.map((p) => p.letter);
export const FINAL_WORD = "THRIVE";
