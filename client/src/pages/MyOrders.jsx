// import React from 'react'
// import { useSelector } from 'react-redux'

// const MyOrders = () => {

//   const orders = useSelector(state => state.orders.order)
//   console.log("order items", orders)

//   return (
//     <div>
//       <div className='p-2 shadow-md top-0 bg-white flex items-center justify-between'>
//         <h2 className='font-semibold '>My order</h2>
//       </div>
//       {
//         !orders[0] && (
//           <p>No Data</p>
//         )
//       }
//       {
//         orders.map((order, index) => {
//           return (
//             <div key={order._id + index + "order"} className='order rounded p-4 text-sm border'>
//               <p>Order No : {order?.orderId}</p>
//               <div className='flex gap-3'>
//                 <img
//                   src={order.product_details.image[0]}
//                   className='w-14 h-14'
//                 />
//                 <div className='grid gap-5'>
//                   <p className='text-2xl'>{order.product_details.name}</p>
//                   <p className='text-xs'> Rs. {order.totalAmt}</p>
//                   <p className='text-xs'><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
//                   <p className='text-xs'><strong>Status:</strong> {order.orderStatus}</p>
//                 </div>
//               </div>
//             </div>
//           )
//         })
//       }

//     </div>
//   )
// }

// export default MyOrders











import React from 'react'
import { useSelector } from 'react-redux'
import { Package, Calendar, Clock, IndianRupee, Truck, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

const MyOrders = () => {
  const orders = useSelector(state => state.orders.order)

  const getStatusIcon = (status) => {
    const statusMap = {
      'pending': <Clock className="w-4 h-4 text-yellow-500" />,
      'processing': <Package className="w-4 h-4 text-blue-500" />,
      'shipped': <Truck className="w-4 h-4 text-purple-500" />,
      'delivered': <CheckCircle className="w-4 h-4 text-green-500" />,
      'cancelled': <XCircle className="w-4 h-4 text-red-500" />
    }
    return statusMap[status?.toLowerCase()] || <AlertCircle className="w-4 h-4 text-gray-500" />
  }

  const getStatusColor = (status) => {
    const colorMap = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'processing': 'bg-blue-100 text-blue-800',
      'shipped': 'bg-purple-100 text-purple-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    }
    return colorMap[status?.toLowerCase()] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Package className="w-6 h-6 text-indigo-600" />
              <h2 className="text-xl font-semibold text-gray-900">My Orders</h2>
            </div>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {orders?.length || 0} orders
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {!orders || orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-500">When you place an order, it will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => (
              <div 
                key={order._id + index + "order"} 
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                {/* Order Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">
                      Order #{order?.orderId?.slice(-8) || 'N/A'}
                    </span>
                    <span className="text-xs text-gray-400">|</span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                    {getStatusIcon(order.orderStatus)}
                    <span>{order.orderStatus || 'Pending'}</span>
                  </div>
                </div>

                {/* Order Content */}
                <div className="p-4 flex flex-col sm:flex-row gap-4">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={order.product_details?.image?.[0] || '/placeholder-image.jpg'}
                      alt={order.product_details?.name || 'Product'}
                      className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                      onError={(e) => {
                        e.target.src = '/placeholder-image.jpg'
                      }}
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-medium text-gray-900 truncate">
                      {order.product_details?.name || 'Product Name'}
                    </h4>
                    
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <IndianRupee className="w-3.5 h-3.5 text-gray-400" />
                        <span className="font-medium text-gray-900">
                          ₹{Number(order.totalAmt).toFixed(2)}
                        </span>
                      </div>
                      {order.quantity && (
                        <div className="text-gray-600">
                          Qty: <span className="font-medium">{order.quantity}</span>
                        </div>
                      )}
                    </div>

                    {/* Additional Info */}
                    {(order.paymentMethod || order.address) && (
                      <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500 space-y-1">
                        {order.paymentMethod && (
                          <p>Payment: <span className="font-medium text-gray-700">{order.paymentMethod}</span></p>
                        )}
                        {order.address && (
                          <p className="truncate">Delivery: <span className="font-medium text-gray-700">{order.address}</span></p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyOrders