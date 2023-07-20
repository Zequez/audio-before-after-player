import "@/globals.css";
import { Inter } from "next/font/google";
import Image from "next/image";
import logo from "@/logo.svg";
import AuthProvider from "@/lib/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Before After Audio Player",
  description: "A simple before after audio player",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
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
          <AuthProvider>{children}</AuthProvider>
        </main>
      </body>
    </html>
  );
}
