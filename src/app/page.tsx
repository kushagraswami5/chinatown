import HeroSection from "@/components/home/HeroSection"
import CategoriesSection from "@/components/home/CategoriesSection"
import FeaturedProducts from "@/components/home/FeaturedProducts"
import FeaturesSection from "@/components/home/FeaturesSection"
import VendorSection from "@/components/home/VendorSection"
import Footer from "@/components/home/Footer"

export default async function HomePage(){

  const products:any[] = [] // fetch later from API

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