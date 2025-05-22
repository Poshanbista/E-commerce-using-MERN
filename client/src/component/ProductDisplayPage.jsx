import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { AxiosToastError } from '../utils/AxiosToastError';
import { Axios } from '../utils/axios';
import { summaryApi } from '../common/summary.api';
import Divider from './Divider';
import { DisplayPriceInRs } from '../utils/DisplayPriceInRs';
import { PriceWithDiscount } from '../utils/PriceWithDiscount';
import { useSelector } from 'react-redux';
import AddToCartButton from './AddToCartButton';

const ProductDisplayPage = () => {
  const params = useParams();
  let productId = params?.product?.split("-")?.slice(-1)[0];
  
  const [data, setData] = useState({
    name: "",
    image: []
  });
  
  const [image, setImage] = useState(0);
  const cartItem = useSelector(state => state.cartItem.cart);
  const user = useSelector(state => state.user); // Fetch user from Redux store
  
  const [isAvailableCart, setIsAvailableCart] = useState(false);
  const [qty, setQty] = useState(0);
  const [cartItemDetails, setCartItemDetails] = useState();

  console.log(cartItem);

  // Fetch product details
  const fetchProductDetails = async () => {
    try {
      const response = await Axios({
        ...summaryApi.getProductDetails,
        data: {
          productId: productId
        }
      });

      const { data: responseData } = response;

      if (responseData.success) {
        setData(responseData.data);
        if (fetchCartItem) {
          fetchCartItem();
        }
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [params]);

  const storeRecentView = async (productId) => {
    try {
      await Axios({
        ...summaryApi.recent_view,
        productId
      });
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className='container mx-auto p-4 grid grid-cols-2'>
      <div className='col-span-1'>
        <div className='bg-white rounded min-h-[75vh]  max-h-[75vh] w-full h-full '>
          <img
            src={data.image[image]}
            className='w-full h-full object-scale-down '
          />
        </div>
        <div className='flex items-center justify-center gap-2'>
          {
            data.image.map((img, index) => {
              return (
                <div key={img + index + "point"} className={`bg-slate-300 w-5 h-5 rounded-full ${index === image ? "bg-slate-500" : ""}`}></div>
              );
            })
          }
        </div>
        <div>
          <div className='flex gap-4'>
            {
              data.image.map((img, index) => {
                return (
                  <div className='w-20 h-20 shadow-md' key={img + index}>
                    <img
                      src={img}
                      onClick={() => setImage(index)}
                      className='w-full h-full object-scale-down cursor-pointer'
                    />
                  </div>
                );
              })
            }
          </div>
        </div>
        <div>
          <h2 className='font-semibold py-2'>Description</h2>
          <div className='text-base '>{data.description}</div>
        </div>
      </div>

      <div className='p-4 pl-9'>
        <h2 className='text-3xl font-semibold'>{data.name}</h2>
        <h2 className=''>{data.unit}</h2>
        <h2 className='text-xl py-3 font-semibold'> {data.ram}, {data.ssd}, {data.processor}</h2>
        <Divider />
        <div>
          <p className='text-xl'>Price</p>
          <div className=' gap-3'>
            <div className='border p-2 border-green-500 rounded bg-green-100 w-fit'>
              <p className='font-semibold text-xl'>{DisplayPriceInRs(PriceWithDiscount(data.price, data.discount))}</p>
            </div>
            <div className='flex items-center gap-3'>
              {
                data.discount && (
                  <p className='line-through'>{DisplayPriceInRs(data.price)}</p>
                )
              }
              {
                data.discount && (
                  <p className=' '>-{data.discount}%</p>
                )
              }
            </div>
          </div>
        </div>
        {
          data.stock === 0 ? (
            <p className='py-3 text-red-400'>Out of Stock</p>
          ) : (
            user._id ? ( // Only show the AddToCartButton if the user is logged in
              <AddToCartButton data={data} />
            ) : (
              <p></p>
            )
          )
        }
      </div>
    </section>
  );
};

export default ProductDisplayPage;
