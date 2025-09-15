import './FeaturedProducts.css'
import { getProducts } from '../../jsFunctions/Api/getProducts'
import ApiLoading from '../Api Loading/ApiLoading'
import ProductsItem from '../ProductsItem/ProductsItem';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import useNoDark from '../../Hooks/useNoDark';


export default function FeaturedProducts() {

    let {noDark} = useNoDark();
    
    let { data : response, isLoading, isError, error,  } = useQuery({
        queryKey: ['home'],
        queryFn: getProducts,
        select : (data)=>data.data
    });




    if (isLoading) {
        return (
            <ApiLoading></ApiLoading>
        )
    }
    else {
        if (isError) {
            return (
                <div>{error.message}</div>
            )
        }
        else {
            return (
                <>
                    <button className={`btn-wishlist btn mb-4 ${noDark}`}>
                        <Link to='/wishlist'>
                            Your wishlist
                            <i className="fa-solid fa-heart fa-beat ms-2" />
                        </Link>
                    </button>
                    <div className="row g-5">
                        {response.data.map((elem) => <ProductsItem key={elem._id} prodItem={elem}></ProductsItem>)}

                    </div>
                </>
            )
        }
    }

}
