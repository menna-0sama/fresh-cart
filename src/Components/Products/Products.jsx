import { useQuery } from '@tanstack/react-query'
import './Products.css'
import axios from 'axios'
import ApiLoading from '../Api Loading/ApiLoading';
import ProductsItem from '../ProductsItem/ProductsItem';
import useQueryCategories from '../../Hooks/useQueryCategories';
import { getCategories } from '../../jsFunctions/Api/getCategories';
import { useEffect, useRef, useState } from 'react';
import useQueryBrands from '../../Hooks/useQueryBrands';
import getBrands from '../../jsFunctions/Api/getBrands';
import { useDispatch, useSelector } from 'react-redux';
import { setActivate, setBrandActivetemp, setBrandId, setCatActivetemp, setCatId } from '../../libs/slices/productsSlice';
import useNoDark from '../../Hooks/useNoDark';



export default function Products() {

    let {noDark} = useNoDark();

    let catIDtemp = useSelector((slice) => slice.products.catIdtemp);
    let brandIDtemp = useSelector((slice) => slice.products.brandIdtemp);
    let catActivetemp = useSelector((slice) => slice.products.catActivetemp);
    let brandActivetemp = useSelector((slice) => slice.products.brandActivetemp);
    let activate = useSelector((slice) => slice.products.activate);
    let dispatch = useDispatch();

    let [catId, setCat] = useState(catIDtemp);
    let [brandId, setBrand] = useState(brandIDtemp);
    let [catActive, setCatActive] = useState(catActivetemp);
    let [brandActive, setbrandActive] = useState(brandActivetemp);

    let inputRef = useRef();



    let [searchred, setSearched] = useState('');
    let [filter, setFilter] = useState(true);


    function getProductsBy(cat, brand) {

        if (cat != '') {
            if (brand)
                cat = '&category[in]=' + cat;
            else
                cat = '?category[in]=' + cat;
        }
        if (brand != '') {
            brand = '?brand=' + brand;
        }


        return axios.get(`https://ecommerce.routemisr.com/api/v1/products${brand}${cat}`);
    }


    let { data: productsResponse, isLoading: productsLoading, isError: productsIsError, error: productsError } = useQuery({
        queryKey: ['products', catId, brandId],
        queryFn: ({ queryKey }) => {
            return getProductsBy(queryKey[1], queryKey[2]);
        },
        select: (data) => {
            if(searchred == '')
                return data.data;
            else{
                let response = data.data;
                return {data :response.data.filter((elem)=>elem.title.trim().toLowerCase().includes(searchred.trim().toLowerCase()))}
                
            }
        }
    });


    let { data: categoriesResponse, isLoading: categoriesLoading, isError: categoriesIsError, error: categoriesError } = useQueryCategories(getCategories);
    let { data: brandsResponse, isLoading: brandsLoading, isError: brandsIsError, error: brandsError } = useQueryBrands(getBrands);

    useEffect(() => {
        window.addEventListener('resize', function () {
            if (this.innerWidth > 991) {
                setFilter(true);
            }
        });

    }, []);

    useEffect(() => {
        if (categoriesResponse && !activate.one) {
            setCatActive(categoriesResponse.data.map((elem) => Boolean(!elem)));
            dispatch(setCatActivetemp(categoriesResponse.data.map((elem) => Boolean(!elem))));
            dispatch(setActivate({ ...activate, one: true }));
        }
    }, [categoriesResponse]);

    useEffect(() => {
        if (brandsResponse && !activate.two) {
            setbrandActive(brandsResponse.data.map((elem) => Boolean(!elem)));
            dispatch(setBrandActivetemp(brandsResponse.data.map((elem) => Boolean(!elem))));
            dispatch(setActivate({ ...activate, two: true }));
        }
    }, [brandsResponse]);

    useEffect(()=>{
        if(productsLoading)
            setSearched('');
    }, [productsLoading])


    if (productsLoading || categoriesLoading || brandsLoading) {
        return (
            <ApiLoading></ApiLoading>
        )
    }
    else {
        if (productsIsError || categoriesIsError || brandsIsError) {
            return (
                <section className='products py-5'>
                    <div className="container">
                        {productsIsError ? productsError.message : categoriesError ? categoriesError : brandsError}
                    </div>
                </section>
            )
        }
        else {
            return (
                <section className='products py-5 position-relative'>
                    <div className="container-fluid ">
                        <div className={`filter position-absolute top-0 start-0 h-100 ${!filter ? 'hide' : ''} `}>
                            <div className={`filter-box ${filter ? 'overflow-y-scroll' : ''} position-sticky`}>
                                <div className=' px-2 py-4'>
                                    <div className={`filter-bar d-flex flex-column justify-content-between mb-3 p-2 rounded d-lg-none ${noDark}`} onClick={() => setFilter(!filter)}>
                                        <span className=' w-50 rounded'></span>
                                        <span className=' w-75 rounded'></span>
                                        <span className=' w-100 rounded'></span>
                                    </div>
                                    {filter ? <ul className=' list-unstyled mb-5'>
                                        <h5 className=' text-capitalize mb-3'>categories</h5>
                                        <li className={` mb-2 p-1 rounded ${catId ? '' : `active ${noDark}`}`} onClick={() => { setCat(''); dispatch(setCatId('')); setCatActive(catActive.map(() => false)); dispatch(setCatActivetemp(catActivetemp.map(() => false))); }}>
                                            All
                                        </li>
                                        {categoriesResponse.data.map((elem, i) =>
                                            <li key={elem._id} className={` mb-2 p-1 rounded ${catActive[i] ? `active ${noDark}` : ''}`} onClick={() => { setCat(elem._id); dispatch(setCatId(elem._id)); setCatActive(catActive.map((elem, j) => j == i ? true : false)); dispatch(setCatActivetemp(catActivetemp.map((elem, j) => j == i ? true : false))) }}>
                                                {elem.name}
                                            </li>)}
                                    </ul> : ''}
                                    {filter ? <ul className=' list-unstyled'>
                                        <h5 className=' text-capitalize mb-3'>brands</h5>
                                        <li className={` mb-2 p-1 rounded ${brandId ? '' : `active ${noDark}`}`} onClick={() => { setBrand(''); dispatch(setBrandId('')); setbrandActive(brandActive.map(() => false)); dispatch(setBrandActivetemp(brandActivetemp.map(() => false))) }}>
                                            All
                                        </li>
                                        {brandsResponse.data.map((elem, i) =>
                                            <li key={elem._id} className={` mb-2 p-1 rounded ${brandActive[i] ? `active ${noDark}` : ''} `} onClick={() => { setBrand(elem._id); dispatch(setBrandId(elem._id)); setbrandActive(brandActive.map((elem, j) => j == i ? true : false)); dispatch(setBrandActivetemp(brandActivetemp.map((elem, j) => j == i ? true : false))) }}>
                                                {elem.name}
                                            </li>)}
                                    </ul> : ''}
                                </div>

                            </div>
                        </div>

                        <div className="row g-4 justify-content-evenly overflow-hidden">
                            <div className={`search d-flex mb-5 align-items-center p-0 mx-auto ${noDark}`}>
                                <input type="text" ref={inputRef} className='  form-control w-fit  flex-grow-1 rounded-0 ' />
                                <button className='btn rounded-0' onClick={() => { setSearched(inputRef.current.value); }}>Search</button>
                            </div>
                            {productsResponse.data.length ? productsResponse.data.map((elem) => <ProductsItem key={elem._id} prodItem={elem}></ProductsItem>) : 'No item in this categories'}
                        </div>
                    </div>
                </section>
            )
        }
    }
}
