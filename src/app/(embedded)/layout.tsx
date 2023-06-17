import React from "react";
import Head from "next/head";
import "./embed.css";

export const metadata = {
  title: "Before After Audio Player",
  description: "A simple before after audio player",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <title>Before / After Audio Player</title>
      </Head>
      <body>{children}</body>
    </html>
  );
}
