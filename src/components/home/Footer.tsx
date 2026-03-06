export default function Footer(){

  return(

    <footer className="border-t py-10">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center md:text-left">

        <div>
          <h3 className="font-bold text-lg mb-3">
            ChinaTown
          </h3>

          <p className="text-muted-foreground text-sm max-w-xs mx-auto md:mx-0">
            Authentic Chinese products delivered across the UK.
          </p>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-3">
            Support
          </h3>

          <ul className="space-y-2 text-muted-foreground text-sm">
            <li className="hover:text-black cursor-pointer">Contact</li>
            <li className="hover:text-black cursor-pointer">Shipping</li>
            <li className="hover:text-black cursor-pointer">Returns</li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-3">
            Legal
          </h3>

          <ul className="space-y-2 text-muted-foreground text-sm">
            <li className="hover:text-black cursor-pointer">Privacy Policy</li>
            <li className="hover:text-black cursor-pointer">Terms</li>
          </ul>
        </div>

      </div>

      <p className="text-center text-muted-foreground text-sm mt-8">
        © {new Date().getFullYear()} ChinaTown Marketplace
      </p>

    </footer>

  )
}