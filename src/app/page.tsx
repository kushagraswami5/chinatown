import HeroSection from "@/components/home/HeroSection"
import CategoriesSection from "@/components/home/CategoriesSection"
import FeaturedProducts from "@/components/home/FeaturedProducts"
import FeaturesSection from "@/components/home/FeaturesSection"
import VendorSection from "@/components/home/VendorSection"
import Footer from "@/components/home/Footer"

async function getProducts() {
  // Use relative URL so it works in all environments (local, staging, production)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/products`, { cache: "no-store" });
  const data = await res.json();
  return data.products;
}

export default async function HomePage() {
  const products = await getProducts();

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
