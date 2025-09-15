import { useMutation, useQueryClient } from '@tanstack/react-query';
import './ProductInCart.css'
import { removeProductCart } from '../../jsFunctions/Api/removeProductCar';
import { useEffect, useState } from 'react';
import { updateCartItem } from '../../jsFunctions/Api/updateCartItem';
import useNoDark from '../../Hooks/useNoDark';

export default function ProductInCart({ elem, isFetching }) {

    let{noDark} = useNoDark();

    let [errorHide, setErrorHide] = useState(false);
    let [clickedRemove, setClickedRemove] = useState(false);
    let [clickedUpdate, setClickedUpdate] = useState(false);

    useEffect(()=>{
        if(!isFetching){
            setClickedRemove(false);
            setClickedUpdate(false);
        }
    }, [isFetching])


    const queryClient = useQueryClient();



    let { mutate : remove, isPending : pendingRemove, isError : isErrorRemove, error : errorRemove } = useMutation(
        {
            mutationFn: removeProductCart,
            retry: 3,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['cart'] });
            },

            onError: () => {
                setTimeout(() => {
                    setErrorHide(true);
                }, 20000);
                setClickedRemove(false);
            }
        }
    );

    let {mutate : update, isPending: pendingUpdate, isError : isErrorUpdate, error : errorUpdate } = useMutation({
        mutationFn : updateCartItem, 
        retry : 3, 
        onSuccess : ()=>{
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        }, 

        onError : ()=>{
            setTimeout(() => {
                setErrorHide(true);
            }, 20000);
            setClickedUpdate(false);
        }
    }) 


    function removeProduct(id) {
        remove(id);
        setClickedRemove(true);
        setErrorHide(false);
    }

    function updateProduct(q) {
        if(q == 'plus'){
            update({id : elem.product._id, count : elem.count+1});
        }
        else if(q == 'minus'){
            if(elem.count == 1){
                removeProduct(elem.product.id);
            }
            else{
                update({id : elem.product._id, count : elem.count-1});
            }
        }

        setClickedUpdate(true);
        setErrorHide(false);
    }

    return (
        <>
            <tr key={elem._id} className={`prod border border-2 border-start-0 border-end-0 border-top-0 border-black ${clickedRemove && !isErrorRemove && 'opacity-50'}`}>
                <td className=' py-2 px-1 text-start'>
                    <img src={elem.product.imageCover} className={` object-fit-cover rounded ${noDark}`} alt="" />
                </td>
                <td className=' py-2 px-1 fs-4'>
                    <div className=' d-flex xy-center position-relative z-0'>
                        <span onClick={()=>updateProduct('minus')} className='minus bg-secondary-subtle rounded-circle d-inline-flex xy-center me-2' style={{ width: '25px', height: '25px', cursor: 'pointer', fontSize : '12px' }}>
                            <i className="fa-solid fa-minus"></i>
                        </span>
                        <span className={` text-black loader position-absolute top-50 start-50 z-n1 ${(pendingUpdate || isFetching) && clickedUpdate ? 'opacity-1' : 'opacity-0'}`} style={{borderColor : 'black', borderBottomColor : 'transparent'}}/>
                        <span className={` m-0 ${(pendingUpdate || isFetching) && clickedUpdate ? 'opacity-0' : 'opacity-1'}`}>
                            {elem.count}
                        </span>
                        <span onClick={()=>updateProduct('plus')} className='plus bg-secondary-subtle rounded-circle d-inline-flex xy-center ms-2' style={{ width: '25px', height: '25px', cursor: 'pointer', fontSize : '12px' }}>
                            <i className="fa-solid fa-plus" />
                        </span>
                    </div>
                </td>
                <td className=' py-2 px-1 fs-4'>{elem.price} EGP</td>
                <td className=' py-2 px-1 fs-4'>
                    <button className={`btn btn-danger text-capitalize position-relative z-0 ${noDark}`} onClick={() => removeProduct(elem.product.id)}>
                        <p className={` m-0 ${(pendingRemove || isFetching) && clickedRemove ? 'opacity-0' : 'opacity-1'}`}>
                            remove
                            <i className="fa-solid fa-trash ms-2" />
                        </p>
                        <span className={`loader position-absolute top-50 start-50 z-n1 ${(pendingRemove || isFetching) && clickedRemove ? 'opacity-1' : 'opacity-0'}`} />
                    </button>
                </td>
                {isErrorRemove ? <span className={`error bg-danger p-2 position-absolute rounded text-white ${errorHide && 'opacity-0'}`}>
                    {errorRemove.message}
                </span> : ''}
                {isErrorUpdate ? <span className={`error bg-danger p-2 position-absolute rounded text-white ${errorHide && 'opacity-0'}`}>
                    {errorUpdate.message}
                </span> : ''}
            </tr>

        </>
    )
}
