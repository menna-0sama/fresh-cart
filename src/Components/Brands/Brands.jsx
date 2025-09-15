import useQueryBrands from '../../Hooks/useQueryBrands'
import './Brands.css'
import getBrands from '../../jsFunctions/Api/getBrands'
import ApiLoading from '../../Components/Api Loading/ApiLoading'
import { Link} from 'react-router-dom';
import { useEffect, useRef } from 'react';

export default function Brands() {


    let { data: response, isLoading, isError, error } = useQueryBrands(getBrands);

    let catRef = useRef([]);

    function showScroll() {
        
        for (let i = 0; i < catRef.current.length; i++) {
            
            if (window.scrollY > catRef.current[i].offsetTop - window.innerHeight + 100){
                catRef.current[i].style.cssText = `
                                                        opacity : 1;
                                                        transform : translateY(0px);
                                                    `;
            }
        }
    }

    
    
    useEffect(() => {
        
        if(response){
            showScroll();        
            window.addEventListener('scroll', showScroll);
    
            return () => { 
                window.removeEventListener('scroll', showScroll);
            }
        }
    }, [response]);


    if (isLoading) {
        return (
            <div className=' py-5'>
                <ApiLoading></ApiLoading>
            </div>
        )
    }
    else {
        if (isError) {
            return (
                <section className='brands py-5'>
                    <div className="container">
                        {error.message}
                    </div>
                </section>
            )
        }
        else {
            return (
                <div className='brands py-5 overflow-hidden'>
                    <div className="container">
                    <h2 className='h1 text-center text-capitalize mb-5'>brands</h2>
                        <div className="row g-5">
                            {response.data.map((elem, i) => <div key={elem._id} className=" col-lg-4 col-sm-6">
                                <Link  to={`/productsBy/brands/${elem._id}`} style={{color : 'black'}}>
                                    <div className="inner shadow rounded overflow-hidden" ref={l => catRef.current[i] = l} style={{ opacity: '0', transform : 'translateY(40px)' }}>
                                        <img src={elem.image} className=' w-100 object-fit-cover' alt="" />
                                        <h2 className=' text-center p-2'>{elem.name}</h2>
                                    </div>
                                </Link>
                            </div>)}

                        </div>
                    </div>
                </div>
            )
        }
    }


}
