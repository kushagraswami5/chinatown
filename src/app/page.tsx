import HeroSection from "@/components/home/HeroSection"
import CategoriesSection from "@/components/home/CategoriesSection"
import FeaturedProducts from "@/components/home/FeaturedProducts"
import FeaturesSection from "@/components/home/FeaturesSection"
import VendorSection from "@/components/home/VendorSection"
import Footer from "@/components/home/Footer"
import { prisma } from "@/lib/prisma"

async function getProducts() {
  // Query Prisma directly — never fetch localhost in server components
  return prisma.product.findMany({
    include: { images: true, category: true },
    orderBy: { createdAt: "desc" },
    take: 8,
  })
}

export default async function HomePage() {
  const products = await getProducts()

  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <CategoriesSection />
      <FeaturedProducts products={products} />
      <VendorSection />
      <Footer />
    </main>
  )
}
