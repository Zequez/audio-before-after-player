import "@/globals.css";
import { Inter } from "next/font/google";
import Image from "next/image";
import logo from "@/logo.svg";
import AuthProvider from "@/lib/AuthProvider";
import Header from "@/components/Header";

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
      <body className={`${inter.className} min-h-screen`}>
        <AuthProvider>
          <Header />
          <main className="p-4 sm:p-12 sm:max-w-6xl mx-auto items-center">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
