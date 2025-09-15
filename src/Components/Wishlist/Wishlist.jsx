import { useQuery } from "@tanstack/react-query"
import getWishlist from "../../jsFunctions/Api/getWishlist"
import ApiLoading from "../Api Loading/ApiLoading";
import ProductsItem from "../ProductsItem/ProductsItem";
import { useState } from "react";

export default function Wishlist() {

    const [hideWishLogo] = useState(true);

    
    let {data : response, isLoading, isError, error} =  useQuery({
        queryKey : ['wishlist'], 
        queryFn : getWishlist, 
        select : (data)=>data.data
    });

    


    if(isLoading){
        return(
            <ApiLoading></ApiLoading>
        )
    }
    else{
        if(isError){
            <section className=" wishlist py-5">
            <div className="container">
                {error.message}
            </div>
        </section>
        }
        else{
            return (
                <section className=" wishlist py-5 overflow-x-hidden px-2 px-sm-0">
                    <div className="container">
                        <h2 className=" text-capitalize text-center mb-4">your wishlist</h2>
                        <div className="row g-5">
                            {response.data.map((elem) =>
                                <ProductsItem key={elem._id} prodItem={elem} hideWishLogo={hideWishLogo}></ProductsItem>
                            )}
                        </div>
                    </div>
                </section>
            )
        }
    }

}
