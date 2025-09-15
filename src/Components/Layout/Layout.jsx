import { Outlet } from "react-router-dom";
import NavBar from "../NavBar/NavBar";
import Footer from "../Footer/Footer";
import './Layout.css'
import { useContext, useEffect, useState } from "react";
import { authentication } from "../../Context/Authentication/AuthenticationContext";



export default function Layout() {

    let [showRest, setShowReset] = useState(false)
    let {isLogin} = useContext(authentication);

    function resetScroll(){
        window.scrollTo(0, 0);
    }

    function scrollReset(){
        if(window.scrollY > 60)
            setShowReset(true);
        else
            setShowReset(false);
    }

    useEffect(()=>{
        if(isLogin){
            window.addEventListener('scroll', scrollReset);
        }

        return ()=>{
            window.removeEventListener('scroll', scrollReset);
        }
    }, [isLogin]);


    return (
        <>
            {isLogin?<div className={`reset-scroll bg-danger position-fixed d-flex xy-center bg-black text-white rounded-circle ${showRest?'opacity-1':'opacity-0'}`} onClick={resetScroll}>
                <i className="fa-solid fa-up-long" />
            </div>:''}
            
            <NavBar></NavBar>
            <Outlet></Outlet>
            <Footer></Footer>
        </>
    )
}
