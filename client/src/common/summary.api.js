
export const baseURL = "http://localhost:9000"

export const summaryApi = {
    register: {
        url: '/api/register',
        method: 'post'
    },
    login: {
        url: '/api/login',
        method: 'post'
    },
    forgot_password: {
        url: '/api/forgotPassword',
        method: 'put'
    },
    Otp_verification: {
        url: '/api/verifyOtp',
        method: 'put'
    },
    reset_password: {
        url: '/api/resetPassword',
        method: 'put'
    },
    user_details: {
        url: '/api/user-details',
        method: 'get'
    },
    logout: {
        url: '/api/logout',
        method: 'get'
    },
    update_user_details: {
        url: '/api/updateUserDetails',
        method: 'put'
    },
    add_category: {
        url: '/api/category/addCategory',
        method: 'post'
    },
    get_category: {
        url: '/api/category/get',
        method: 'get'
    },
    update_category: {
        url: '/api/category/updateCategory',
        method: 'put'
    },
    delete_category: {
        url: '/api/category/deleteCategory',
        method: 'delete'
    },
    add_subCategory: {
        url: '/api/subCategory/addSubCategory',
        method: 'post'
    },
    get_subCategory: {
        url: '/api/subCategory/getSubCategory',
        method: 'get'
    },
    delete_subCategory: {
        url: '/api/subCategory/deleteSubCategory',
        method: 'delete'
    },
    uploadImage: {
        url: '/api/file/upload',
        method: 'post'
    },
    addProduct: {
        url: '/api/product/addProduct',
        method: 'post'
    },
    getProduct: {
        url: '/api/product/getProduct',
        method: 'post'
    },
    home: {
        url: '/api/product/',
        method: 'post'
    },
    updateProduct: {
        url: '/api/product/updataProduct',
        method: 'put'
    },
    deleteProduct: {
        url: '/api/product/deleteProduct',
        method: 'delete'
    },
    getProductDetails: {
        url: '/api/product/getProductDetails',
        method: 'post'
    },
    addCart: {
        url: '/api/cart/addCart',
        method: 'post'
    },
    recent_view:{
        url:'/api/product/recent_view',
        method:'post'
    },
    recommended:{
        url:'/api/recommended',
        method:'post'
    },
    getCartItem:{
        url:'/api/cart/getCart',
        method:'get'
    },
    updateCartQty:{
        url:'/api/cart/update-qty',
        method:'put'
    },
    deleteCartItem:{
        url:'/api/cart/deleteCartItem',
        method:'delete'
    },
    addAddress:{
        url:'/api/address/addAddress',
        method:'post'
    },
    getAddress:{
        url:'/api/address/getAddress',
        method:'get'
    },
    editAddress:{
        url:'/api/address/editAddress',
        method:'put'
    },
    deleteAddress:{
        url:'/api/address/deleteAddress',
        method:'delete'
    },
    cashOnDelivery:{
        url:'/api/order/cash-on-delivery',
        method:'post'
    },
    getOrderList:{
        url:'/api/order/getOrder',
        method:'get'
    }
   

}

