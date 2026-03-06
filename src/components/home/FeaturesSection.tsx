import { ShieldCheck, Truck, Star } from "lucide-react"

export default function FeaturesSection(){

  return(

    <section className="max-w-7xl mx-auto py-14 px-4 sm:px-6 lg:px-8">

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 text-center">

        <div className="flex flex-col items-center">
          <ShieldCheck className="mb-3 text-[#C8102E]" size={32}/>
          
          <h3 className="font-semibold text-lg md:text-xl">
            Authentic Heritage
          </h3>

          <p className="text-muted-foreground mt-2 text-sm md:text-base max-w-xs">
            Traditional Chinese craftsmanship curated for modern homes.
          </p>
        </div>

        <div className="flex flex-col items-center">
          <Star className="mb-3 text-[#C8102E]" size={32}/>

          <h3 className="font-semibold text-lg md:text-xl">
            Premium Quality
          </h3>

          <p className="text-muted-foreground mt-2 text-sm md:text-base max-w-xs">
            Carefully selected authentic products from trusted vendors.
          </p>
        </div>

        <div className="flex flex-col items-center">
          <Truck className="mb-3 text-[#C8102E]" size={32}/>

          <h3 className="font-semibold text-lg md:text-xl">
            UK Delivery
          </h3>

          <p className="text-muted-foreground mt-2 text-sm md:text-base max-w-xs">
            Secure shipping across the UK with premium packaging.
          </p>
        </div>

      </div>

    </section>

  )
}