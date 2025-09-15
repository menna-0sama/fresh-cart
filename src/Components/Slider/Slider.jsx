import Slider from "react-slick";
import useQueryCategories from "../../Hooks/useQueryCategories";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getCategories } from "../../jsFunctions/Api/getCategories";
import './Slider.css'
import { Link } from "react-router-dom";
import useNoDark from "../../Hooks/useNoDark";

export default function CatSlider() {

    let {noDark} = useNoDark();

    let { data: response, isSuccess } = useQueryCategories(getCategories);


    const settings = {
        dots: true,
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 2,
        autoplay: true,
        autoplaySpeed: 2000,
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 2,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            }
        ]
    };


    return (
        <div className="slider-container">
            <h2 className=' text-capitalize mb-4 ps-3'>shop popular categories</h2>
            {isSuccess ? <Slider {...settings}>
                {response.data.map((elem) => <div key={elem._id} style={{ width: 300 }}>
                    <Link to={`/productsBy/categories/${elem._id}`} style={{color : 'black'}}>
                        <div className=" p-2">
                            <img src={elem.image} className={` w-100 rounded ${noDark}`} alt="" />
                        </div>
                    </Link>
                </div>)}
            </Slider> : ''}

        </div>
    );
}

