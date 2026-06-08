import { Inter, Georama } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const georama = Georama({
  variable: "--font-georama-loaded",
  subsets: ["latin"],
});

export const metadata = {
  title: "MacOS Portfolio",
  description: "MacOS style Portfolio",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${georama.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
