import React from 'react'
import { DisplayPriceInRs } from '../utils/DisplayPriceInRs'
import { Link } from 'react-router-dom'
import { validURLConverter } from '../utils/validURLConverter'
import { PriceWithDiscount } from '../utils/PriceWithDiscount'


const ProductCartUser = ({ data, onClick }) => {

    const url = `/product/${validURLConverter(data.name)}-${data._id}`

    return (
        <Link to={url} onClick={onClick} className='shadow-2xl p-4 grid gap-3 max-w-52 rounded'>
            <div className='min-h-20 max-h-20 rounded'>
                <img
                    src={data.image[0]}
                    className='w-full h-full object-scale-down scale-125'
                />
            </div>

            <div className='font-medium text-ellipsis line-clamp-2'>
                {data.name}  {data.ram}, {data.ssd}, {data.processor}
            </div>


            <div className='flex items-center justify-between gap-3'>
                <div className=' '>
                    {DisplayPriceInRs(PriceWithDiscount(data.price, data.discount))}
                </div>
                <div >
                    {
                        Boolean(data.discount) && (
                            <p className='text-green-700 bg-green-200 px-2 w-fit text-xs rounded-full'>{data.discount}% dis</p>

                        )
                    }
                </div>
            </div>
        </Link>
    )
}

export default ProductCartUser
