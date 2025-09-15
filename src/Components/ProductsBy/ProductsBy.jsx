import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import ApiLoading from "../Api Loading/ApiLoading";
import { useParams } from "react-router-dom";
import ProductsItem from "../ProductsItem/ProductsItem";
import './ProductsBy.css'
import { useRef, useState } from "react";
import useNoDark from "../../Hooks/useNoDark";

export default function ProductsBy() {

    let {noDark} = useNoDark();
    
    let [searchred, setSearched] = useState('');
    
    
    let { id, by } = useParams();
    let inputRef = useRef();


    function getProductBy(endPoint, id) {
        endPoint = (endPoint == 'categories') ? 'category[in]' : 'brand';

        return axios.get(`https://ecommerce.routemisr.com/api/v1/products?${endPoint}=${id}`);
    }

    const { data: response, isLoading, isError, error } = useQuery({
        queryKey: ['productsBy', by, id],
        queryFn: ({ queryKey }) => {

            return getProductBy(queryKey[1], queryKey[2]);
        },
        select: (data) => {
            if(searchred == '')
                return data.data;
            else{
                let response = data.data;
                return {data :response.data.filter((elem)=>elem.title.trim().toLowerCase().includes(searchred.trim().toLowerCase()))}
                
            }
        }, 
        refetchOnWindowFocus : false
    });


    if (isLoading) {
        return (
            <ApiLoading></ApiLoading>
        )
    }
    else {
        if (isError) {
            return (
                <section className="productsBy py-5">
                    <div className="container">
                        {error.message}
                    </div>
                </section>
            )
        }
        else {
            return (
                <section className="productsBy py-5 px-2 px-sm-0 overflow-x-hidden">
                    <div className="container">
                        {response.data.length?<div className={`search d-flex mb-5 align-items-center flex-wrap flex-sm-nowrap ${noDark}`}>
                            <input type="text" ref={inputRef} className={`  form-control w-fit  flex-grow-1 rounded-0  `} />
                            <button className='btn rounded-0 h-100 ' onClick={()=>{setSearched(inputRef.current.value); }}>Search</button>
                        </div>:''}
                        

                        <div className="row g-5">
                            {!response.data.length ? <p className=" text-center">No product found</p> : response.data.map((elem) => {
                                return <ProductsItem key={elem._id} prodItem={elem}></ProductsItem>
                            })}
                        </div>
                    </div>
                </section>
            )
        }
    }

}
