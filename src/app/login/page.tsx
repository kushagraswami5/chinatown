"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"

export default function LoginPage(){

  const router = useRouter()

  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")

  const login = async ()=>{

    try{

      const res = await api.post("/auth/login",{
        email,
        password
      })

      localStorage.setItem("token",res.data.token)

      const role = res.data.user.role

      if(role === "VENDOR"){
        router.push("/vendor")
      }else{
        router.push("/products")
      }

    }catch(err){
      alert("Login failed")
    }

  }

  return(

    <div className="max-w-md mx-auto py-20">

      <h1 className="text-3xl font-bold mb-8">
        Login
      </h1>

      <input
        placeholder="Email"
        className="border p-3 w-full mb-4"
        onChange={(e)=>setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="border p-3 w-full mb-6"
        onChange={(e)=>setPassword(e.target.value)}
      />

      <Button
        onClick={login}
        className="bg-[#C8102E] w-full"
      >
        Login
      </Button>

    </div>
  )
}