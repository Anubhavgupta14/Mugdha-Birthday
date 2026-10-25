# Operation: Heal Planet Earth 🌍

A birthday escape-room game for Mugdha Pradhan, Founder & CEO of iThrive, from the team.

Planet Earth has a fever. The Sugar Syndicate (Lord Glucose Spike, Baron Seed Oil and Count Cortisol) has wrecked Gaia's gut. The Chief Healing Officer has to find the root cause across 3 levels and 6 puzzles. Each puzzle gives her a seed letter, and each level ends with a gift.

| Level | Puzzles | Gift |
| --- | --- | --- |
| 1 · The Gut of Gaia | Gutder (swipe to feed the microbiome), Microbiome Vault (code lock) | 🔥 The Phoenix + "Girl on Fire" |
| 2 · The Sugar Syndicate's Power Plant | Cipher wheel, Flatten the glucose curve | 🐉 The Dragons + "Believer" |
| 3 · The Root of All Things | Planet ↔ body diagnosis, Panch Mahabhuta sequence | 💰 ₹25 Cr manifestation + "Unstoppable" |
| Final Gate | Unscramble the seed letters | 🪷 Divine Mother's blessing, a healed Earth, Hall of Fame, wishes and a playlist |

Every puzzle has 3 hints from Mito the mitochondrion, then a 👑 **CEO Override** button that skips it.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

Progress is saved in localStorage, so a refresh resumes the quest. To jump to any stage while previewing, use `?stage=<name>`, e.g. `/?stage=vault`, `/?stage=gift2` or `/?stage=finale`. Stage names are listed in `STAGES` in `src/pages/index.tsx`.

## Edit the words

- **Wishes, achievements, songs and the blessing:** `src/game/content.ts`. The wishes are placeholders signed by teams, so swap in real names and messages.
- **Puzzle briefs, hints and solved lines:** `src/game/puzzles.ts`.
- **Photos:** `public/img/` holds the optimized portrait and a transparent cut-out made from the original shoot photo.

All music in the game is synthesized live with the Web Audio API. The English songs are YouTube embeds, so they need an internet connection.
# Mugdha-Birthday
