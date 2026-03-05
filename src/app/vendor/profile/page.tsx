"use client"

import { useState } from "react"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"

export default function VendorProfile(){

  const [form,setForm] = useState({
    businessName:"",
    warehouseAddress:"",
    description:""
  })

  const submit = async ()=>{

    await api.post("/vendor/profile",form)

    alert("Vendor profile created")
  }

  return(

    <div className="max-w-xl mx-auto py-16">

      <h1 className="text-3xl font-bold mb-8">
        Store Profile
      </h1>

      <input
        placeholder="Business Name"
        className="border p-3 w-full mb-4"
        onChange={(e)=>setForm({...form,businessName:e.target.value})}
      />

      <input
        placeholder="Warehouse Address"
        className="border p-3 w-full mb-4"
        onChange={(e)=>setForm({...form,warehouseAddress:e.target.value})}
      />

      <textarea
        placeholder="Store description"
        className="border p-3 w-full mb-6"
        onChange={(e)=>setForm({...form,description:e.target.value})}
      />

      <Button
        onClick={submit}
        className="bg-[#C8102E]"
      >
        Save Profile
      </Button>

    </div>
  )
}