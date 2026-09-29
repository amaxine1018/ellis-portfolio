import type { Metadata } from "next";
import { Averia_Sans_Libre, Azeret_Mono } from "next/font/google";
import "./globals.css";

const averia = Averia_Sans_Libre({
  variable: "--font-averia",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const azeret = Azeret_Mono({
  variable: "--font-azeret",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "Ellis Aguilar",
    template: "%s · Ellis Aguilar",
  },
  description:
    "Portfolio of Ellis Aguilar — product builder using AI to drive innovation.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${averia.variable} ${azeret.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-bg-base text-text-primary">
        {children}
      </body>
    </html>
  );
}
