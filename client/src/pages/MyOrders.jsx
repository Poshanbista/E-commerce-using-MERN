import React from 'react'
import { useSelector } from 'react-redux'

const MyOrders = () => {

  const orders = useSelector(state => state.orders.order)
  console.log("order items", orders)

  return (
    <div>
      <div className='p-2 shadow-md top-0 bg-white flex items-center justify-between'>
        <h2 className='font-semibold '>My order</h2>
      </div>
      {
        !orders[0] && (
          <p>No Data</p>
        )
      }
      {
        orders.map((order, index) => {
          return (
            <div key={order._id + index + "order"} className='order rounded p-4 text-sm border'>
              <p>Order No : {order?.orderId}</p>
              <div className='flex gap-3'>
                <img
                  src={order.product_details.image[0]}
                  className='w-14 h-14'
                />
                <div className='grid gap-5'>
                  <p className='text-2xl'>{order.product_details.name}</p>
                  <p className='text-xs'> Rs. {order.totalAmt}</p>
                  <p className='text-xs'><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          )
        })
      }

    </div>
  )
}

export default MyOrders
