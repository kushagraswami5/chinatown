import "./globals.css"
import Navbar from "@/components/navbar"
import { Ma_Shan_Zheng } from "next/font/google";

const chineseFont = Ma_Shan_Zheng({
  subsets: ["latin"],
  weight: "400"
});

export const metadata = {
  title: "ChinaTown",
  description: "Premium Chinese products in the UK",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body >
        <Navbar />

        <main className="max-w-7xl mx-auto px-6">
          {children}
        </main>
      </body>
    </html>
  )
}