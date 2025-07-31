import React from 'react'

const orderStatus = async(id) => {
  try {
    const res = await fetch(`http://localhost:9000/api/order/accept/${id}`,{
      method: "POST",
       credentials: "include",
      headers:{
        "Content-Type": "application/json"
      }
    })
  } catch (error) {
    toast.error(error.message)
  }
}

export default orderStatus
