// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { useSelector } from "react-redux";

// import { Axios } from "../utils/axios";
// import { AxiosToastError } from "../utils/AxiosToastError";
// import { summaryApi } from "../common/summary.api";

// import Divider from "./Divider";
// import AddToCartButton from "./AddToCartButton";
// import ProductCartUser from "./ProductCartUser";

// import { DisplayPriceInRs } from "../utils/DisplayPriceInRs";
// import { PriceWithDiscount } from "../utils/PriceWithDiscount";

// const ProductDisplayPage = () => {
//   const params = useParams();

//   const productId = params?.product?.split("-")?.slice(-1)[0];

//   const user = useSelector((state) => state.user);

//   const [data, setData] = useState({
//     name: "",
//     image: [],
//   });

//   const [image, setImage] = useState(0);

//   const [recommendedProducts, setRecommendedProducts] = useState([]);

//   const fetchProductDetails = async () => {
//     try {
//       const response = await Axios({
//         ...summaryApi.getProductDetails,
//         data: {
//           productId,
//         },
//       });

//       const { data: responseData } = response;

//       if (responseData.success) {
//         setData(responseData.data);

//         if (user?._id) {
//           await storeRecentView(productId);
//         }
//       }
//     } catch (error) {
//       AxiosToastError(error);
//     }
//   };

//   const fetchRecommended = async (userId) => {
//     try {
//       const response = await Axios({
//         ...summaryApi.recommended,
//         data: {
//           userId,
//         },
//       });

//       const { data: responseData } = response;

//       if (responseData.success) {
//         setRecommendedProducts(responseData.data);
//       }
//     } catch (error) {
//       AxiosToastError(error);
//     }
//   };

//   const storeRecentView = async (productId) => {
//     try {
//       await Axios({
//         ...summaryApi.recent_view,
//         data: {
//           productId,
//           userId: user._id,
//         },
//       });

//       fetchRecommended(user._id);
//     } catch (error) {
//       AxiosToastError(error);
//     }
//   };

//   useEffect(() => {
//     fetchProductDetails();
//   }, [productId]);

//   return (
//     <section className="container mx-auto p-4">
//       <div className="grid grid-cols-2">
//         {/* Left Side */}
//         <div>
//           <div className="bg-white rounded min-h-[75vh] max-h-[75vh] w-full h-full">
//             <img
//               src={data.image[image]}
//               alt={data.name}
//               className="w-full h-full object-scale-down"
//             />
//           </div>

//           <div className="flex justify-center gap-2 mt-3">
//             {data.image.map((img, index) => (
//               <div
//                 key={index}
//                 className={`w-4 h-4 rounded-full ${
//                   image === index ? "bg-slate-600" : "bg-slate-300"
//                 }`}
//               ></div>
//             ))}
//           </div>

//           <div className="flex gap-3 mt-4">
//             {data.image.map((img, index) => (
//               <div
//                 key={index}
//                 className="w-20 h-20 border cursor-pointer"
//                 onClick={() => setImage(index)}
//               >
//                 <img
//                   src={img}
//                   alt=""
//                   className="w-full h-full object-scale-down"
//                 />
//               </div>
//             ))}
//           </div>

//           <div className="mt-5">
//             <h2 className="font-semibold text-lg">Description</h2>

//             <p>{data.description}</p>
//           </div>
//         </div>

//         {/* Right Side */}
//         <div className="pl-10">
//           <h1 className="text-3xl font-semibold">{data.name}</h1>

//           <p>{data.unit}</p>

//           <h2 className="text-xl py-3 font-semibold">
//             {data.ram}, {data.ssd}, {data.processor}
//           </h2>

//           <Divider />

//           <div>
//             <p className="text-xl mb-2">Price</p>

//             <div className="border border-green-500 bg-green-100 p-2 rounded w-fit">
//               <p className="font-semibold text-xl">
//                 {DisplayPriceInRs(
//                   PriceWithDiscount(data.price, data.discount)
//                 )}
//               </p>
//             </div>

//             {data.discount && (
//               <div className="flex gap-3 mt-2">
//                 <p className="line-through">
//                   {DisplayPriceInRs(data.price)}
//                 </p>

//                 <p>-{data.discount}%</p>
//               </div>
//             )}
//           </div>

//           {data.stock === 0 ? (
//             <p className="text-red-500 mt-4">Out of Stock</p>
//           ) : (
//             user?._id && (
//               <div className="mt-5">
//                 <AddToCartButton data={data} />
//               </div>
//             )
//           )}
//         </div>
//       </div>

//       {/* Recommended Products */}
//       {recommendedProducts.length > 0 && (
//         <div className="mt-14">
//           <h2 className="text-2xl font-semibold mb-4">
//             You may also like
//           </h2>

//           <div className="grid grid-cols-5 gap-4">
//             {recommendedProducts.map((product) => (
//               <ProductCartUser
//                 key={product._id}
//                 data={product}
//               />
//             ))}
//           </div>
//         </div>
//       )}
//     </section>
//   );
// };

// export default ProductDisplayPage;






import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { Axios } from "../utils/axios";
import { AxiosToastError } from "../utils/AxiosToastError";
import { summaryApi } from "../common/summary.api";

import Divider from "./Divider";
import AddToCartButton from "./AddToCartButton";
import ProductCartUser from "./ProductCartUser";

import { DisplayPriceInRs } from "../utils/DisplayPriceInRs";
import { PriceWithDiscount } from "../utils/PriceWithDiscount";
import { categoryFieldNames } from "../utils/categoryFields";

// Icons for delivery information
import { 
  FaTruck, 
  FaShieldAlt, 
  FaUndo, 
  FaClock,
  FaBox,
  FaTag
} from "react-icons/fa";

const ProductDisplayPage = () => {
  const params = useParams();

  const productId = params?.product?.split("-")?.slice(-1)[0];

  const user = useSelector((state) => state.user);

  const [data, setData] = useState({
    name: "",
    image: [],
  });

  const [image, setImage] = useState(0);

  const [recommendedProducts, setRecommendedProducts] = useState([]);

  const fetchProductDetails = async () => {
    try {
      const response = await Axios({
        ...summaryApi.getProductDetails,
        data: {
          productId,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        setData(responseData.data);

        if (user?._id) {
          await storeRecentView(productId);
        }
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const fetchRecommended = async (userId) => {
    try {
      const response = await Axios({
        ...summaryApi.recommended,
        data: {
          userId,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        setRecommendedProducts(responseData.data);
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const storeRecentView = async (productId) => {
    try {
      await Axios({
        ...summaryApi.recent_view,
        data: {
          productId,
          userId: user._id,
        },
      });

      fetchRecommended(user._id);
    } catch (error) {
      AxiosToastError(error);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  // Calculate discount price
  const discountPrice = PriceWithDiscount(data.price, data.discount);
  const isOutOfStock = data.stock === 0;

  return (
    <section className="container mx-auto p-4">
      <div className="grid grid-cols-2 gap-8">
        {/* Left Side */}
        <div>
          <div className="bg-white rounded-xl shadow-lg min-h-[75vh] max-h-[75vh] w-full h-full overflow-hidden">
            <img
              src={data.image[image]}
              alt={data.name}
              className="w-full h-full object-scale-down transition-transform duration-300 hover:scale-105"
            />
          </div>

          <div className="flex justify-center gap-3 mt-4">
            {data.image.map((img, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  image === index ? "bg-blue-600 w-8" : "bg-gray-300"
                }`}
              ></div>
            ))}
          </div>

          <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
            {data.image.map((img, index) => (
              <div
                key={index}
                className={`flex-shrink-0 w-20 h-20 border-2 rounded-lg cursor-pointer transition-all duration-200 overflow-hidden ${
                  image === index 
                    ? "border-blue-600 shadow-md shadow-blue-100" 
                    : "border-gray-200 hover:border-gray-400"
                }`}
                onClick={() => setImage(index)}
              >
                <img
                  src={img}
                  alt=""
                  className="w-full h-full object-scale-down"
                />
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h2 className="font-semibold text-xl mb-3 flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
              Description
            </h2>
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <p className="text-gray-700 leading-relaxed">{data.description}</p>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="pl-6">
          <h1 className="text-3xl font-bold text-gray-900">{data.name}</h1>

          {data.unit && (
            <p className="text-gray-600 mt-1 text-sm">{data.unit}</p>
          )}

          {(data.ram || data.ssd || data.processor || data.dpi || data.resolution || data.switchType || data.driverSize || data.screenSize) && (
            <h2 className="text-lg py-3 font-semibold text-gray-700">
              {(() => {
                const categoryName = data.category?.name || ""
                const fields = categoryFieldNames[categoryName] || []
                const specs = fields.map(f => data[f]).filter(Boolean).join(", ")
                return specs || [data.ram, data.ssd, data.processor].filter(Boolean).join(", ")
              })()}
            </h2>
          )}

          <Divider />

          <div>
            <p className="text-xl font-semibold mb-3 text-gray-800">Price</p>

            <div className="border-2 border-green-500 bg-green-50 p-3 rounded-xl w-fit">
              <p className="font-bold text-2xl text-green-700">
                {DisplayPriceInRs(discountPrice)}
              </p>
            </div>

            {data.discount > 0 && (
              <div className="flex gap-3 mt-3 items-center">
                <p className="line-through text-gray-400 text-lg">
                  {DisplayPriceInRs(data.price)}
                </p>
                <p className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
                  -{data.discount}%
                </p>
              </div>
            )}
          </div>

          {/* Stock Status */}
          <div className="mt-4">
            {isOutOfStock ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg inline-block">
                <span className="font-semibold">Out of Stock</span>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg inline-block">
                <span className="font-semibold">In Stock</span>
                {data.stock > 0 && data.stock <= 10 && (
                  <span className="ml-2 text-sm text-orange-600">(Only {data.stock} left!)</span>
                )}
              </div>
            )}
          </div>

          {!isOutOfStock && user?._id && (
            <div className="mt-5">
              <AddToCartButton data={data} />
            </div>
          )}

          {/* Delivery Information */}
          <div className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaBox className="text-blue-600" />
              Delivery Information
            </h3>
            
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-3 bg-white/70 p-3 rounded-lg hover:bg-white transition-all duration-200">
                <div className="bg-blue-100 p-2 rounded-full">
                  <FaTruck className="text-blue-600 text-lg" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Free Delivery</p>
                  <p className="text-sm text-gray-600">On orders above ₹499</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/70 p-3 rounded-lg hover:bg-white transition-all duration-200">
                <div className="bg-green-100 p-2 rounded-full">
                  <FaClock className="text-green-600 text-lg" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Estimated Delivery</p>
                  <p className="text-sm text-gray-600">3-5 business days</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/70 p-3 rounded-lg hover:bg-white transition-all duration-200">
                <div className="bg-purple-100 p-2 rounded-full">
                  <FaUndo className="text-purple-600 text-lg" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Easy Returns</p>
                  <p className="text-sm text-gray-600">30 days return policy</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/70 p-3 rounded-lg hover:bg-white transition-all duration-200">
                <div className="bg-orange-100 p-2 rounded-full">
                  <FaShieldAlt className="text-orange-600 text-lg" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Warranty</p>
                  <p className="text-sm text-gray-600">1 year manufacturer warranty</p>
                </div>
              </div>

              {data.stock > 0 && data.stock <= 10 && (
                <div className="mt-2 bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                  <p className="text-sm text-yellow-800 flex items-center gap-2">
                    <FaTag className="text-yellow-600" />
                    <span className="font-medium">Hurry!</span> 
                    Only {data.stock} items left in stock
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Products */}
      {recommendedProducts.length > 0 && (
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            You may also like
          </h2>

          <div className="grid grid-cols-5 gap-4">
            {recommendedProducts.map((product) => (
              <ProductCartUser
                key={product._id}
                data={product}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductDisplayPage;



