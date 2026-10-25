import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="description" content="Operation Heal Planet Earth — a birthday quest for Mugdha Pradhan, from Team iThrive." />
        <meta name="theme-color" content="#0b0820" />
        <link rel="icon" href="/logo.png" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
