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
      <ThemeProvider>
        <body
          className={`${sora.variable} ${orbitron.variable}  antialiased overflow-x-hidden relative dark transition-all duration-300 w-screen h-screen`}
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