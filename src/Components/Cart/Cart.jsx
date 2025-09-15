import {  useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import './Cart.css'
import { getProductCart } from '../../jsFunctions/Api/getProductsCart'
import ApiLoading from '../Api Loading/ApiLoading'

import ProductInCart from '../ProductInCart/ProductInCart'
import ModalPayment from '../Modal/Modal'
import deleteCart from '../../jsFunctions/Api/deleteCart'
import useNoDark from '../../Hooks/useNoDark'

export default function Cart() {

    let{noDark} = useNoDark();

    const queryClient = useQueryClient();

    let { isLoading, isFetching, isError, error, data: response } = useQuery(
        {
            queryKey: ['cart'],
            queryFn: getProductCart,
            select: (data) => data?.data,
            gcTime: 0,
            refetchOnWindowFocus: false,
        }
    );

    
    let {mutate, isPending} = useMutation(
        {
            mutationFn : deleteCart, 
            onSuccess : ()=>{                
                queryClient.invalidateQueries({queryKey : ['cart']});
            },
            
            
        } 
    );


    if (isLoading) {
        return (
            <div className='py-5'>
                <ApiLoading></ApiLoading>
            </div>
        )
    }
    else {
        if (isError) {
            return (
                <div className="cart py-5">
                    <div className="container">
                        {error.message}
                    </div>
                </div>
            )
        }
        else {
            return (
                <div className="cart py-5">
                    <div className="container">
                        <div className=' fs-5'>
                            Number of cart items : 
                            <p className={`text-green d-inline-block fw-bold ms-3 ${noDark}`}>
                                {response?.numOfCartItems}
                            </p>
                        </div>
                        <div className=' fs-5 mb-4'>
                            Total price :
                            <p className={`text-green d-inline-block fw-bold ms-3 ${noDark}`}>
                                {response?.data.totalCartPrice} EGP
                            </p>
                        </div>
                        {response?.data.products.length?
                        <button className={` btn btn-danger position-relative z-0 ${noDark}`} onClick={()=>mutate()}>
                            <span className={`${isPending || isFetching?'opacity-0':'opacity-1'}`}>
                                Delete cart
                            </span>
                            <span className={`loader position-absolute top-50 start-50 z-n1 ${isPending || isFetching?'opacity-1':'opacity-0'}`} />
                        </button>
                        :''}
                        
                        <table className=' w-100 position-relative mt-4'>
                            <thead className=' text-center text-capitalize border  border-2 border-start-0 border-end-0 border-top-0 border-black'>
                                <tr>
                                    <th className=' py-2 px-1'>product</th>
                                    <th className=' py-2 px-1'>QTY</th>
                                    <th className=' py-2 px-1'>price</th>
                                    <th className=' py-2 px-1'>action</th>
                                </tr>
                            </thead>

                            <tbody className=' text-center'>
                                {response?.data.products.map((elem) => <ProductInCart key={elem.product._id} elem={elem} isFetching={isFetching} ></ProductInCart>)}

                            </tbody>
                        </table>
                        <div className="payment mt-4">
                            <ModalPayment button="online" cartId={response?.cartId}></ModalPayment>
                            <ModalPayment button="cash" cartId={response?.cartId}></ModalPayment>
                        </div>
                    </div>
                </div>
            )
        }
    }



}
