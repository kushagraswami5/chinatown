"use client"

import { useState } from "react"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"

export default function RegisterPage(){

  const [form,setForm] = useState({
    name:"",
    email:"",
    password:""
  })

  const register = async ()=>{

    try{

      await api.post("/auth/register",{
        ...form,
        role:"CONSUMER"
      })

      alert("Account created")

      window.location.href="/login"

    }catch(err){
      alert("Registration failed")
    }

  }

  return(

    <div className="max-w-md mx-auto py-20">

      <h1 className="text-3xl font-bold mb-8">
        Create Account
      </h1>

      <input
        placeholder="Name"
        className="border p-3 w-full mb-4"
        onChange={(e)=>setForm({...form,name:e.target.value})}
      />

      <input
        placeholder="Email"
        className="border p-3 w-full mb-4"
        onChange={(e)=>setForm({...form,email:e.target.value})}
      />

      <input
        type="password"
        placeholder="Password"
        className="border p-3 w-full mb-6"
        onChange={(e)=>setForm({...form,password:e.target.value})}
      />

      <Button
        onClick={register}
        className="bg-[#C8102E] w-full"
      >
        Register
      </Button>

    </div>
  )
}