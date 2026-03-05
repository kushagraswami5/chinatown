"use client"

import { useState } from "react"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"

export default function AddAddressPage(){

  const [form,setForm] = useState({
    fullName:"",
    line1:"",
    city:"",
    postcode:"",
    country:"UK",
    phone:""
  })

  const submit = async ()=>{

    await api.post("/address",form)

    alert("Address added")

    window.location.href="/checkout"
  }

  return(

    <div className="max-w-xl mx-auto py-16">

      <h1 className="text-3xl font-bold mb-8">
        Add Address
      </h1>

      <input
        placeholder="Full Name"
        className="border p-3 w-full mb-4"
        onChange={(e)=>setForm({...form,fullName:e.target.value})}
      />

      <input
        placeholder="Address Line"
        className="border p-3 w-full mb-4"
        onChange={(e)=>setForm({...form,line1:e.target.value})}
      />

      <input
        placeholder="City"
        className="border p-3 w-full mb-4"
        onChange={(e)=>setForm({...form,city:e.target.value})}
      />

      <input
        placeholder="Postcode"
        className="border p-3 w-full mb-4"
        onChange={(e)=>setForm({...form,postcode:e.target.value})}
      />

      <Button onClick={submit} className="bg-[#C8102E]">
        Save Address
      </Button>

    </div>
  )
}