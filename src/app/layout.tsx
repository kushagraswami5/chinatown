import "./globals.css"
import Navbar from "@/components/navbar"
import { Toaster } from "@/components/ui/sonner"

export const metadata = {
  title: "ChinaTown",
  description: "Premium Chinese products in the UK",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="max-w-7xl mx-auto px-6">
          {children}
        </main>
        <Toaster position="bottom-right" />
      </body>
    </html>
  )
}
