import React from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import orderStatus from '../services/orderStatus.service'
import { FiCheck, FiClock, FiUser, FiDollarSign, FiCalendar, FiPhone } from 'react-icons/fi'
import { BsBoxSeam } from 'react-icons/bs'

const ManageOrderPage = () => {
  const orders = useSelector(state => state.orders.order)

  const handleAcceptOrder = async (orderId) => {
    try {
      await orderStatus(orderId)
      toast.success("Order accepted successfully!")
      // window.location.reload();
    } catch (error) {
      toast.error("Failed to accept order")
      console.error("Order acceptance error:", error)
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'accept':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium flex items-center gap-1">
          <FiCheck size={12} /> Accepted
        </span>
      default:
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium flex items-center gap-1">
          <FiClock size={12} /> <p className='text-xs'><strong>Status:</strong> {status}</p>
        </span>
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className='bg-white rounded-lg shadow-sm p-4 mb-6 border-b border-gray-100'>
        <h2 className='text-2xl font-bold text-gray-800'>Order Management</h2>
        <p className='text-gray-600'>View and manage customer orders</p>
      </div>

      {/* Empty State */}
      {!orders[0] && (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <BsBoxSeam size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">No orders yet</h3>
          <p className="text-gray-500">When customers place orders, they'll appear here.</p>
        </div>
      )}

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Product Info */}
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0">
                  <img
                    src={order.product_details.image[0]}
                    className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                    alt={order.product_details.name}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg mb-1">
                    {order.product_details.name}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <FiDollarSign size={14} />
                    <span>Rs. {order.totalAmt.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FiCalendar size={14} />
                    <span className="text-sm">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-700">
                  <FiUser size={16} className="text-blue-500" />
                  <span className="font-medium">{order.userId?.name || 'Guest'}</span>
                </div>
                <div className="text-sm text-gray-600 pl-6">
                  {order.userId?.email}
                </div>
                {order.userId?.mobile && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 pl-6">
                    <FiPhone size={14} />
                    {order.userId.mobile}
                  </div>
                )}
              </div>

              {/* Order Actions */}
              <div className="flex flex-col items-end justify-between">
                <div className="mb-4">
                  {getStatusBadge(order.orderStatus)}
                </div>
                {order.orderStatus !== "accepted" && (
                  <button
                    onClick={() => handleAcceptOrder(order._id)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <FiCheck size={16} />
                    Accept Order
                  </button>
                )}
              </div>
            </div>

            {/* Additional order details could go here */}
            {/* <div className="bg-gray-50 px-5 py-3 border-t border-gray-100">
              More details...
            </div> */}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ManageOrderPage