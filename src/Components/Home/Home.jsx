import FeaturedProducts from '../FeaturedProducts/FeaturedProducts'
import CatSlider from '../Slider/Slider'
import './Home.css'


export default function Home() {

    

    return (
        <section className='home px-sm-0 px-3 overflow-hidden'>
            <div className="container py-5 ">
                <div className=' py-4 mb-5'>
                    <CatSlider></CatSlider>
                </div>
                <FeaturedProducts></FeaturedProducts>
            </div>

            
        </section>
    )
}
