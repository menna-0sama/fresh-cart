import { useEffect, useRef, useState } from "react"
import { getSpecificProduct } from "../../jsFunctions/Api/getSpecificProduct.js";
import { useParams } from "react-router-dom";
import ApiLoading from "../Api Loading/ApiLoading";

import './ProductDetails.css'
import { getProductsByCategory } from "../../jsFunctions/Api/getProductsByCategory.js";
import ProductsItem from "../ProductsItem/ProductsItem.jsx";
import useMutationCart from "../../Hooks/useMutationCart.jsx";
import addProductToCart from "../../jsFunctions/Api/addProductToCart.js";
import useNoDark from "../../Hooks/useNoDark.jsx";

export default function ProductDetails() {

    let {noDark} = useNoDark();

    let [details, setDetails] = useState('');
    let [relatedProducts, setRelatedProducts] = useState('');
    let [errorMsg, setErrorMsg] = useState('');
    let { id, categoryId} = useParams();
    let [updateLoading, setUpdateLoading] = useState(false);
    let sliderActive = useRef('');
    let [modalImg, setModalImg] = useState({
        src: '',
        close: false
    });

    function changeImg(event) {
        setModalImg({ ...modalImg, src: event.target.src });
        document.body.style.setProperty('overflow', 'hidden');
    }

    function closeModal(event) {
        if(event.type == "click" || event.key == "Escape"){
            setModalImg({ ...modalImg, close: true });
            setTimeout(() => {
                setModalImg({ src: '', close: false });
                document.body.style.setProperty('overflow', 'visible');
            }, 1400);
        }
    }

    const getSpecificProductApi = async function () {
        let response = await getSpecificProduct(id);
        if (response?.data) {
            setDetails(response.data.data);
        }
        else {
            setErrorMsg(response.message);
        }
        setUpdateLoading(false);
        sliderActive.current.click();

    }

    const getProductsByCategoryApi = async function(){
        let response = await getProductsByCategory(categoryId);
        if(response?.data){
            setRelatedProducts(response.data.data);
        }
        else{
            setErrorMsg(response.message)
        }
    }

    let { mutate: mutateCart, isPending: isPendingCart } = useMutationCart(addProductToCart);
    
    function clickToAdd(event, id) {
        mutateCart(id);
        event.stopPropagation();
    }


    useEffect(() => {
        getSpecificProductApi();
        getProductsByCategoryApi();
    }, []);

    useEffect(() => {
        if(modalImg.src)
            document.addEventListener('keyup', closeModal);

        return () => {
            document.removeEventListener('keyup', closeModal);
        }
    }, [modalImg]);

    useEffect(()=>{
        if(details){
            setUpdateLoading(true);
            getSpecificProductApi();
            window.scrollTo(0, 0);
        }
    }, [id]);



    if (details && relatedProducts) {
        return (
            <section className="product-details overflow-hidden px-sm-0 px-3"> 
                <div className="container py-5 ">
                    <div className="row g-4 pb-5 border border-2 border-black border-top-0 border-start-0 border-end-0">
                        <div className=" col-lg-5">
                            <div id="carouselExampleFade" className="carousel slide carousel-fade">
                                <div className={`carousel-indicators rounded w-fit m-0 mx-auto px-2 py-1 mb-2 flex-wrap ${noDark}`}>
                                    <button type="button" data-bs-target="#carouselExampleFade" data-bs-slide-to={0} className={`active w-fit`} aria-current="true" aria-label={`Slide 1`} style={{ height: 'fit-content', textIndent: '0' }} ref={sliderActive}>
                                        <img src={details.imageCover} alt="" className={``} style={{ width: '40px' }} />
                                    </button>
                                    {details.images.map((elem, i) => {
                                        return <button key={i} type="button" data-bs-target="#carouselExampleFade" data-bs-slide-to={i + 1} className={`w-fit`}  aria-label={`Slide ${i + 2}`} style={{ height: 'fit-content', textIndent: '0' }} >
                                            <img src={elem} alt=""  className={``} style={{ width: '40px' }} />
                                        </button>
                                    })}
                                </div>

                                <div className="carousel-inner">
                                    <div className={`carousel-item active position-relative ${noDark}`}>
                                        {updateLoading&&<ApiLoading grayed={{width : '100%' , height : '100%', backgroundColor : '#808080b8', position : 'absolute' }} ></ApiLoading>}
                                        <img src={details.imageCover} className="d-block w-100" alt="..." onClick={changeImg}  />
                                    </div>
                                    {details.images.map((elem, i) => {
                                        return <div key={i} className={`carousel-item position-relative ${noDark}`}>
                                            {updateLoading&&<ApiLoading grayed={{width : '100%' , height : '100%', backgroundColor : '#808080b8', position : 'absolute' }} ></ApiLoading>}
                                            <img src={elem} className="d-block w-100" alt="..." onClick={changeImg} />
                                        </div>
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className=" col-lg-7 pt-5">
                            <h2 className="title fw-bold h4">{details.title}</h2>
                            <p className=" text-muted">{details.description}.</p>
                            <p className={`category mb-2 h5 ${noDark}`}>{details.category.name}</p>
                            <div className="">
                                <p className="brand">Brand : {details.brand.name}</p>
                                <p className="quantity">Quantity : {details.quantity}</p>
                                <div className='d-flex justify-content-between'>
                                    <p className='price'>{details.price} EGP</p>
                                    <span>
                                        <i className={`fa-solid fa-star me-1 ${noDark}`} style={{ color: 'gold' }}></i>
                                        {details.ratingsAverage}
                                    </span>
                                </div>
                            </div>

                            <button className={`btn w-100 mt-4 position-relative z-0 ${noDark}`} onClick={(event) => clickToAdd(event, id)}>
                                <p className={` m-0 ${isPendingCart?'opacity-0' : 'opacity-1'}`}>
                                    Add to cart
                                    <i className="fa-solid fa-cart-shopping ms-2" />
                                </p>
                                <span className={`loader position-absolute top-50 start-50 z-n1 ${isPendingCart?'opacity-1':'opacity-0'}`} />
                            </button>
                        </div>
                    </div>
                    <div className="related-products py-5 ">
                        <h2 className={` text-capitalize fw-bold mb-4 w-fit pb-3 position-relative ${noDark}`}>- related products ({details.category.name})</h2>
                        <div className="row g-5">
                            {relatedProducts.map((elem)=><ProductsItem key={elem._id} prodItem={elem}></ProductsItem>)}
                        </div>

                    </div>
                </div>

                {modalImg.src && <div className={`over-lay rounded p-4 position-fixed h-100 w-100 top-0 start-0 d-flex xy-center ${noDark} ${modalImg.close ? 'close' : ''}`} onClick={closeModal}>
                    <div className=" p-4" onClick={function(event){event.stopPropagation()}}>
                        <img src={modalImg.src} className=" w-100" alt="" />
                    </div>
                </div>}

            </section>
        )
    }
    else {
        if (errorMsg) {
            return (
                <section className="product-details">
                    {errorMsg}
                </section>
            )
        }
        else {
            return (
                <section className="product-details">
                    <ApiLoading></ApiLoading>
                </section>
            )
        }
    }

}





