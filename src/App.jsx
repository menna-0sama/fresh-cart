import { createBrowserRouter, createHashRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Layout from './Components/Layout/Layout'
import Register from './Components/Register/Register'
import Home from './Components/Home/Home'
// import Cart from './Components/Cart/Cart'
import Products from './Components/Products/Products'
import Categories from './Components/Categories/Categories'
import Brands from './Components/Brands/Brands'
import Login from './Components/Login/Login'
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute'
import ProductDetails from './Components/ProductDetails/ProductDetails'
import ProductsBy from './Components/ProductsBy/ProductsBy'
import NotFound from './Components/NotFound/NotFound'
import ResetPassword from './Components/ResetPassword/ResetPassword'
import Wishlist from './Components/Wishlist/Wishlist'
import { QueryClientProvider, useQuery } from '@tanstack/react-query'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useDispatch } from 'react-redux'
import getWishlist from './jsFunctions/Api/getWishlist'
import { lazy, Suspense, useContext, useEffect } from 'react'
import { setWishlistItems } from './libs/slices/wishlistSlice'
import ApiLoading from './Components/Api Loading/ApiLoading'
import LoadingRegister from './Components/Loading register/LoadingRegister'
import Darkmode from './Components/Darkmode/Darkmode'
import DarkmodeContext from './Context/Darkmode/DarkmodeContext'
import { authentication } from './Context/Authentication/AuthenticationContext'

let Cart = lazy(()=> import('./Components/Cart/Cart'));

export default function App() {

  let{isLogin} = useContext(authentication);

  const dispatch = useDispatch();


  let { data: response, isSuccess } = useQuery({
    queryKey: ['wishlist'],
    queryFn: getWishlist,
    select: (data) => data.data,
    enabled : isLogin
  });

  useEffect(() => {
    if (isSuccess) {
      dispatch(setWishlistItems(response.data.map((elem) => elem.id)));
    }
  }, [isSuccess]);


  const routes = createHashRouter([
    {
      path: '/', element: <Layout></Layout>, children: [
        { index: true, element: <ProtectedRoute><Home></Home></ProtectedRoute> },
        { path: '/cart', element: <ProtectedRoute><Suspense fallback={<ApiLoading></ApiLoading>}><Cart></Cart></Suspense></ProtectedRoute> },
        { path: '/products', element: <ProtectedRoute><Products></Products></ProtectedRoute> },
        { path: '/categories', element: <ProtectedRoute><Categories></Categories></ProtectedRoute> },
        { path: '/brands', element: <ProtectedRoute><Brands></Brands></ProtectedRoute> },
        { path: '/productsBy/:by/:id', element: <ProtectedRoute><ProductsBy></ProductsBy></ProtectedRoute> },
        { path: '/register', element: <Register></Register> },
        { path: '/login', element: <Login></Login> },
        { path: '/resetPassword', element: <ResetPassword></ResetPassword> },
        { path: 'productDetails/:id/:categoryId', element: <ProtectedRoute><ProductDetails></ProductDetails></ProtectedRoute> },
        { path: '/wishlist', element: <ProtectedRoute><Wishlist></Wishlist></ProtectedRoute> },
        { path: '*', element: <NotFound></NotFound> }
      ]
    }
  ])



  return (
    <>
      <ToastContainer></ToastContainer>
      {/* <ReactQueryDevtools  initialIsOpen={false} /> */}
      <DarkmodeContext>
        <Darkmode></Darkmode>
        <RouterProvider router={routes}></RouterProvider>
      </DarkmodeContext>
    </>
  )
}

