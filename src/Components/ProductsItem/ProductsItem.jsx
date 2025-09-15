
import { useNavigate } from 'react-router-dom';
import './ProductsItem.css'
import useMutationCart from '../../Hooks/useMutationCart';
import addProductToCart from '../../jsFunctions/Api/addProductToCart';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import addToWishlist from '../../jsFunctions/Api/addToWishlist';
import { useEffect, useState } from 'react';
import removeFromWishlist from '../../jsFunctions/Api/removeFromWishlist';
import { useSelector } from 'react-redux';
import useNoDark from '../../Hooks/useNoDark';


export default function ProductsItem({ prodItem, hideWishLogo }) {
    let { noDark } = useNoDark();


    const wishlistItems = useSelector((slice) => slice.wishlist.wishlistItems);

    let [wishlisted, setWishlisted] = useState(false);

    let queryClient = useQueryClient();

    let { imageCover, price, title, category, ratingsAverage, _id } = prodItem;

    let navigate = useNavigate();

    function changeId() {
        navigate(`/productDetails/${_id}/${category._id}`);
    }

    let { mutate: mutateCart, isPending: isPendingCart, isSuccess: isSuccessCart } = useMutationCart(addProductToCart);

    function clickToAdd(event, id) {
        mutateCart(id);
        event.stopPropagation();
    }


    let { mutate: mutateWishlist, data: dataWishList, isPending: isPendingWishlist, isSuccess: isSuccessWishlist } = useMutation({
        mutationFn: addToWishlist,
        onSuccess: () => {
            setWishlisted(true);
        },
    });

    let { mutate: mutateRemove, isPending: isPendingRemove } = useMutation({
        mutationFn: removeFromWishlist,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['wishlist']
            })
        }
    });

    useEffect(() => {
        for (let i = 0; i < wishlistItems.length; i++) {
            if (wishlistItems[i] == _id) {
                setWishlisted(true);
                break;
            }
        }
    }, [wishlistItems]);

    return (
        <>
            <div className='product-item  col-xl-3 col-lg-4 col-sm-6 '>
                <div className={`position-relative z-0`}>
                    <div className="inner h-100 d-flex flex-column justify-content-between p-2 rounded" onClick={changeId}>
                        <div className="header mb-3">
                            <img src={imageCover} className={` w-100 rounded mb-2 ${noDark}`} alt="" />
                            <h2 className={`category h6 text-capitalize ${noDark}`}>{category.name}</h2>
                            <h3 className='title h5 text-nowrap overflow-hidden'>{title}</h3>
                        </div>
                        <div className="footer">
                            <div className='d-flex justify-content-between'>
                                <p className='price'>{price}EGP</p>
                                <span>
                                    <i className={`fa-solid fa-star me-1 ${noDark}`} style={{ color: 'gold' }}></i>
                                    {ratingsAverage}
                                </span>
                            </div>
                            <div className=' d-flex align-items-center'>
                                <button className={`btn position-relative z-0 ${noDark}`} onClick={(event) => clickToAdd(event, _id)}>

                                    <p className={` m-0 ${isPendingCart ? 'opacity-0' : 'opacity-1'}`}>
                                        Add to cart
                                        <i className="fa-solid fa-cart-shopping ms-2" />
                                    </p>
                                    <span className={`loader position-absolute top-50 start-50 z-n1 ${isPendingCart ? 'opacity-1' : 'opacity-0'}`} />
                                </button>

                                {hideWishLogo ? <button className={`btn-remove btn btn-danger position-relative z-0 ms-auto ${noDark}`} onClick={(event) => { mutateRemove(_id); event.stopPropagation() }}>
                                    <p className={` m-0 ${isPendingRemove ? 'opacity-0' : 'opacity-1'}`}>
                                        Remove
                                        <i className="fa-solid fa-trash ms-2"></i>
                                    </p>
                                    <span className={`loader position-absolute top-50 start-50 z-n1 ${isPendingRemove ? 'opacity-1' : 'opacity-0'}`} />
                                </button> : ''}


                                {isPendingWishlist ?
                                    <i className={`fa-solid fa-spinner fa-spin-pulse ms-auto ${noDark} `} /> :
                                    !hideWishLogo ?
                                        <i className={`fa-solid fa-heart ms-auto ${noDark}`} style={{ color: wishlisted ? '#2eb92e' : '#b0b0b0', cursor: 'pointer' }} title='add to wishlist' onClick={(event) => { mutateWishlist(_id); event.stopPropagation() }} />
                                        : ''
                                }

                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}
