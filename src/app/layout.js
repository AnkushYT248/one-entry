import { Sora, Orbitron } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import ThemeModifier from "@/components/ui/ThemeModifier";
import {AuthProvider} from "@/context/AuthContext";

const sora = Sora({
  variable: "--font-sora",
  weight: ["100", "200", "400"],
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  weight: ["400", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata = {
  title: "One Entry",
  description: "Track your daily progress with ease and visualize your journey using modern, intuitive tools.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#18181b" />
        <link rel="icon" href="@/app/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="@/app/favicon.ico" />
        <link rel="canonical" href="https://one-entry.vercel.app/" />
        {/* Open Graph */}
        <meta property="og:title" content="One Entry" />
        <meta property="og:description" content="Track your daily progress with ease and visualize your journey using modern, intuitive tools." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://one-entry.vercel.app/" />
        <meta property="og:image" content="/images/hex-textured.optimized.svg" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="One Entry" />
        <meta name="twitter:description" content="Track your daily progress with ease and visualize your journey using modern, intuitive tools." />
        <meta name="twitter:image" content="/images/hex-textured.optimized.svg" />
      </head>
      <ThemeProvider>
        <body
          className={`${sora.variable} ${orbitron.variable} antialiased overflow-x-hidden relative dark transition-all duration-300 w-screen h-screen`}
        >
        <AuthProvider>
        <ThemeModifier />
          {children}
        </AuthProvider>
        </body>
      </ThemeProvider>
    </html>
  );
}