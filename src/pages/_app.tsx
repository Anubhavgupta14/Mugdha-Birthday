import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Caveat, Cinzel, Fraunces, Outfit } from "next/font/google";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", axes: ["SOFT", "opsz"] });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat" });
const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel" });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${fraunces.variable} ${outfit.variable} ${caveat.variable} ${cinzel.variable} font-sans`}>
      <Component {...pageProps} />
    </div>
  );
}
