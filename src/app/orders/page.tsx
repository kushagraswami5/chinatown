"use client"

import { useEffect,useState } from "react"
import api from "@/lib/api"

export default function OrdersPage(){

  const [orders,setOrders] = useState([])

  useEffect(()=>{
    api.get("/orders").then(res=>{
      setOrders(res.data)
    })
  },[])

  return(

    <div className="py-16">

      <h1 className="text-3xl font-bold mb-10">
        Orders
      </h1>

      {orders.map((order:any)=>(
        <div
          key={order.id}
          className="border p-6 mb-4 rounded-lg"
        >

          <p className="font-semibold">
            Order #{order.id}
          </p>

          <p>
            Total: £{order.totalAmount}
          </p>

        </div>
      ))}

    </div>
  )
}