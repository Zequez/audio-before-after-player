import "@/globals.css";
import { Inter } from "next/font/google";
import Image from "next/image";
import Head from "next/head";
import logo from "@/logo.svg";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Before After Audio Player",
  description: "A simple before after audio player",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <body className={inter.className}>
        <main className="min-h-screen p-4 sm:p-12 sm:max-w-6xl mx-auto items-center">
          <h1 className="max-w-[300px] sm:max-w-lg mx-auto mb-4">
            <a href="/">
              <Image
                src={logo}
                alt="SoundToggle - Before and after audio player"
              />
            </a>
          </h1>
          {children}
        </main>
      </body>
    </html>
  );
}
