import type { Metadata } from "next";
import { Nunito  } from "next/font/google";
import BottomNav from "@/components/BottomNav";
import "./globals.css";

const nunito  = Nunito ({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Orbit",
  description: "Rotate. Share. Done.",
  icons: { icon: "/icons/64?round=1", apple: "/icons/180" },
};
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={` h-full antialiased`}
    >
      <body className={`${nunito.className} antialiased`}>
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
