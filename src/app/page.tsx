import HeroSection from "@/components/home/HeroSection"
import CategoriesSection from "@/components/home/CategoriesSection"
import FeaturedProducts from "@/components/home/FeaturedProducts"
import FeaturesSection from "@/components/home/FeaturesSection"
import VendorSection from "@/components/home/VendorSection"
import Footer from "@/components/home/Footer"

async function getProducts() {

  const res = await fetch("https://chinatown-three.vercel.app/api/products", {
    cache: "no-store"
  });

  const data = await res.json();

  return data.products;
}

export default async function HomePage(){

  const products = await getProducts();

  return(
    <main className="min-h-screen">

      <HeroSection/>

      <CategoriesSection/>

      <FeaturedProducts products={products}/>

      <FeaturesSection/>

      <VendorSection/>

      <Footer/>

    </main>
  )
}
