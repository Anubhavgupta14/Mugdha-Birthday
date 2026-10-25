// All the words in one place, so the team can tweak wishes without touching game code.

export const HERO = {
  name: "Mugdha",
  fullName: "Mugdha Pradhan",
  title: "Founder & CEO, iThrive",
  codename: "Chief Healing Officer",
};

export type Song = { id: string; title: string; artist: string; why: string };

export const SONGS = {
  phoenix: { id: "J91ti_MpdHA", title: "Girl on Fire", artist: "Alicia Keys", why: "Because you walked through fire and came out glowing." },
  dragons: { id: "7wtfhZwyrcc", title: "Believer", artist: "Imagine Dragons", why: "You literally imagined dragons. Then you built them." },
  manifest: { id: "cxjvTXo9WWM", title: "Unstoppable", artist: "Sia", why: "Porsche with no brakes. ₹25 Cr loading…" },
  heal: { id: "BWf-eARnf6U", title: "Heal the World", artist: "Michael Jackson", why: "The mission, in one song." },
} satisfies Record<string, Song>;

export const PLAYLIST: Song[] = [
  { id: "inS9gAgSENE", title: "Happy Birthday", artist: "Stevie Wonder", why: "The original birthday anthem." },
  SONGS.heal,
  SONGS.phoenix,
  SONGS.dragons,
  SONGS.manifest,
  { id: "kNKu1uNBVkU", title: "Rise Up", artist: "Andra Day", why: "For every client who rose with you." },
  { id: "CevxZvSJLk8", title: "Roar", artist: "Katy Perry", why: "The eye of the tiger, the fire, the dancing through." },
  { id: "ZbZSe6N_BXs", title: "Happy", artist: "Pharrell Williams", why: "Clap along if you feel like a room without a roof." },
  { id: "JRfuAukYTKg", title: "Titanium", artist: "David Guetta ft. Sia", why: "Bulletproof. Nothing to lose." },
  { id: "rBrd_3VMC3c", title: "What a Wonderful World", artist: "Louis Armstrong", why: "What the world looks like once it's healed." },
];

export type Achievement = { icon: string; title: string; text: string; year?: string };

// Sourced from public interviews (The Better India, StartupTalky, SheThePeople, TEDx, ithrivein.com).
export const ACHIEVEMENTS: Achievement[] = [
  { icon: "🎓", title: "Master of Nutrition", text: "MSc in Food Science & Nutrition, SNDT, Mumbai.", year: "2001" },
  { icon: "🤝", title: "HR to Healer", text: "About 14 years building people and teams at startups in India and Toronto, then she answered the real calling." },
  { icon: "🔥", title: "The Phoenix Comeback", text: "Pre-diabetes, Hashimoto's and depression, reversed at the root. 37 kg lighter in about a year, and radiant.", year: "2017–18" },
  { icon: "🌱", title: "Four Clients, One Big Dream", text: "It started with four clients. Today it's a movement.", year: "2017" },
  { icon: "☀️", title: "iThrive Is Born", text: "Registered in Pune. Functional nutrition, built around the root cause.", year: "2019" },
  { icon: "🎤", title: "TEDx Speaker", text: "On reinventing the healthcare model to reverse the chronic disease epidemic.", year: "2019" },
  { icon: "🏆", title: "SheThePeople 40 Over 40", text: "Named among the award winners, women who are rewriting the rules.", year: "2020" },
  { icon: "💚", title: "3,000+ Lives Changed", text: "174+ health conditions reversed, for clients aged 2 to 75." },
  { icon: "🧬", title: "The ALIVE Program", text: "12 weeks, 60+ blood markers, one root cause at a time." },
  { icon: "🎓", title: "iThrive Academy", text: "Training a new generation of functional nutritionists, 1,000+ practitioners strong." },
  { icon: "🌿", title: "iThrive Essentials", text: "Her own line of supplements, because quality matters.", year: "2021" },
  { icon: "🌍", title: "Healing Across Borders", text: "Clients in the UAE, USA, Australia, Ireland, Singapore and beyond." },
  { icon: "👥", title: "The Tribe", text: "A team of 45+, including 14 functional nutritionists, who all believe in the root cause." },
  { icon: "👑", title: "100% Women-Led Board", text: "iThrive's board is now all women.", year: "2026" },
];

export const NEXT_QUESTS: Achievement[] = [
  { icon: "🪷", title: "10 Lakh Lives", text: "The big one: heal one million people. Earth just became patient #1,000,001." },
  { icon: "💰", title: "₹25 Crore ARR", text: "Manifested, sealed, delivered. The Universe has already signed the cheque." },
];

export type Wish = { text: string; from: string };

// Placeholder signatures. Swap in real names and messages from the team.
export const WISHES: Wish[] = [
  { text: "You didn't just change our diets. You changed how we see health, work and ourselves. Happy birthday, Captain!", from: "Team iThrive" },
  { text: "Thank you for teaching us that every symptom has a story and every story has a root. May this year bring you pure joy, at the root.", from: "Your Functional Nutritionists" },
  { text: "We built a whole game because a normal card couldn't hold this much gratitude. Hope the puzzles made you smile (and only a little bit annoyed).", from: "Anubhav & the Tech Team" },
  { text: "From 4 clients to 3,000+ lives. We can't wait to see you hit 10 lakh. Happy birthday!", from: "The Thrive Tribe" },
  { text: "Happy birthday from every well-fed mitochondrion in the building. We are all powered by you. ⚡", from: "Mito & friends" },
];

export const BLESSING = {
  shloka: "या देवी सर्वभूतेषु शक्तिरूपेण संस्थिता ।\nनमस्तस्यै नमस्तस्यै नमस्तस्यै नमो नमः ॥",
  transliteration: "Yā Devī sarvabhūteṣu śaktirūpeṇa saṃsthitā\nNamastasyai namastasyai namastasyai namo namaḥ",
  meaning: "To the Goddess who lives in all beings as Shakti (power), salutations again and again.",
  message:
    "Dear child, you have carried My light into kitchens, clinics and broken bodies, and into hearts that had given up. Every life you heal heals a little piece of Me, the Earth. This year I bless you with health that overflows, abundance that multiplies, a team that rises with you, and the peace to enjoy all of it. Keep going. I am with you, always.",
};
