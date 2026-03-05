"use client"

import { useEffect, useState } from "react"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"

export default function CheckoutPage() {

  const [addresses,setAddresses] = useState<any[]>([])
  const [selected,setSelected] = useState("")
  const [loading,setLoading] = useState(true)

  const fetchAddresses = async () => {

    try{

      const res = await api.get("/address")
      setAddresses(res.data)

    }catch(err){
      console.error(err)
    }finally{
      setLoading(false)
    }

  }

  useEffect(()=>{
    fetchAddresses()
  },[])

  const placeOrder = async () => {

    if(!selected){
      alert("Please select address")
      return
    }

    try{

      await api.post("/checkout",{
        addressId:selected
      })

      alert("Order placed successfully")

      window.location.href="/orders"

    }catch(err){
      console.error(err)
      alert("Checkout failed")
    }

  }

  if(loading){
    return <p className="p-10">Loading addresses...</p>
  }

  return(

    <div className="max-w-3xl mx-auto py-16">

      <div className="flex justify-between items-center mb-10">

        <h1 className="text-3xl font-bold">
          Checkout
        </h1>

        {/* Add Address Button */}
        <Button
          onClick={()=>window.location.href="/address/new"}
          className="bg-black text-white"
        >
          + Add Address
        </Button>

      </div>

      {addresses.length === 0 && (
        <p className="mb-6 text-gray-500">
          No address found. Please add one.
        </p>
      )}

      <div className="space-y-4">

        {addresses.map((addr)=>(
          
          <div
            key={addr.id}
            onClick={()=>setSelected(addr.id)}
            className={`border p-5 rounded-lg cursor-pointer transition ${
              selected===addr.id
                ? "border-red-500 bg-red-50"
                : "border-gray-200 hover:border-gray-400"
            }`}
          >

            <p className="font-semibold">
              {addr.fullName}
            </p>

            <p>
              {addr.line1}
            </p>

            <p>
              {addr.city} {addr.postcode}
            </p>

          </div>

        ))}

      </div>

      <Button
        onClick={placeOrder}
        className="mt-10 bg-[#C8102E] hover:bg-red-700"
      >
        Place Order
      </Button>

    </div>
  )

}