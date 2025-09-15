import logo from '../../assets/logo.png'
import instagram from '../../assets/instagram logo.png'
import tiktok from '../../assets/TikTok logo.png'
import './NavBar.css'
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { memo, useContext, useEffect, useRef, useState } from 'react';
import { authentication } from '../../Context/Authentication/AuthenticationContext';
import LoadingRegister from '../Loading register/LoadingRegister';
import { jwtDecode } from 'jwt-decode';
import { useQuery } from '@tanstack/react-query';
import { getProductCart } from '../../jsFunctions/Api/getProductsCart';
import useNoDark from '../../Hooks/useNoDark';



function NavBar() {

    let { noDark } = useNoDark();

    let [loadingStatus, setLoadingStatus] = useState(false);

    let [navColor, setNavColor] = useState('#fff');

    let navRef = useRef('');

    function changeAnimation(event) {
        if (!event.currentTarget.classList.contains('collapsed')) {
            event.currentTarget.children[0].children[0].style.setProperty('animation-name', 'bar-top-forward');
            event.currentTarget.children[0].children[2].style.setProperty('animation-name', 'bar-bottom-forward');
        }
        else {
            event.currentTarget.children[0].children[0].style.setProperty('animation-name', 'bar-top-backward');
            event.currentTarget.children[0].children[2].style.setProperty('animation-name', 'bar-bottom-backward');
        }
    }

    let { isLogin, setIsLogin } = useContext(authentication);


    let navigate = useNavigate();

    function logOut() {
        setLoadingStatus(true);
        localStorage.removeItem('user1');
        setTimeout(() => {
            setLoadingStatus(false);
            setIsLogin(false);
            navigate('/login');
        }, 500);
    }

    let { data: response, isSuccess, isLoading } = useQuery(
        {
            queryKey: ['cart'],
            queryFn: getProductCart,
            select: (data) => data?.data,
            gcTime: 0,
            refetchOnWindowFocus: false,
            enabled : isLogin
            
        }
    );

    function scrollNav() {
        if (window.scrollY > 60)
            setNavColor('#eefff1');
        else if (window.scrollY <= 60)
            setNavColor('#fff');

    }

    useEffect(() => {
        window.addEventListener('scroll', scrollNav);
    }, [])


    return (
        <>
            <nav className={`navbar navbar-expand-lg  fixed-top ${noDark}`} ref={navRef} style={{ backgroundColor: navColor, transition: '0.3s' }}>
                <div className="container flex-wrap">
                    <a className={`navbar-brand `} href="/">
                        <img src={logo} alt="" />
                        <h1 className='h3 fw-bold m-0 d-inline-block align-middle'>FreshCart</h1>
                    </a>

                    {isLogin && <button id="humburger-toggler" className="navbar-toggler collapsed p-2 rounded" type="button"
                        data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation" onClick={changeAnimation}>
                        <div id="humburger-bar" className="d-flex flex-column justify-content-center position-relative">
                            <span className="bar-top position-absolute rounded" />
                            <span className="bar-middle rounded" />
                            <span className="bar-bottom position-absolute rounded" />
                        </div>
                    </button>}


                    <div className='sign ms-4 order-lg-3'>
                        <div className='w-fit mx-auto'>
                            {!isLogin && <>
                                <Link to="/login" className="button-link btn mx-2 text-white">Log in</Link>
                                <Link to="/register" className="button-link btn btn-outline-dark ">register</Link>
                            </>}

                            {isLogin && <>
                                <Link className="logout btn btn-outline-dark button-link" onClick={logOut}>Log out</Link>
                                <span className=' ms-2 fw-bold' style={{
                                    color: '#25ad25'
                                }}>Hi
                                    {localStorage.getItem('user1') ? ' ' + jwtDecode(localStorage.getItem('user1')).name : ''}
                                </span>
                            </>}

                        </div>
                    </div>

                    {isLogin && <div className="collapse navbar-collapse order-lg-2" id="navbarSupportedContent">
                        <div className=' py-lg-0 py-3  d-lg-flex align-items-center flex-grow-1'>
                            <ul className="navbar-nav me-auto mb-4 mb-lg-0  text-capitalize " >
                                <li className="nav-item">
                                    <NavLink className="nav-link" to='/'>home</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link position-relative" to='/cart'>
                                        cart
                                        <span className='no-cart position-absolute xy-center top-0 end-0 rounded-circle' style={{ width: 18, height: 18 }}>
                                            {isSuccess ? response?.numOfCartItems : ''}
                                        </span>
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to='/products'>products</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to='/categories'>categories</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to='/brands'>brands</NavLink>
                                </li>
                            </ul>
                            <div className='links'>
                                <h5 className=' text-capitalize fst-italic fw-bold d-lg-none'>social</h5>
                                <ul className=' list-unstyled d-flex mb-0'>
                                    <li className=' me-2 fs-5 ' title='Instagram'>
                                        <a href="https://www.instagram.com/accounts/login/" className='xy-center' target='_blank'>
                                            <img src={instagram} className=' w-100' alt="" />
                                        </a>
                                    </li>
                                    <li className=' mx-1 fs-5 xy-center' title='Facebook'>
                                        <a href="https://www.facebook.com/" className='xy-center' style={{ color: '#1877F2' }} target='_blank'>
                                            <i className="fa-brands fa-facebook"></i>
                                        </a>
                                    </li>
                                    <li className=' mx-1 fs-5 ' title='Tiktok'>
                                        <a href="https://www.tiktok.com/login" className='xy-center' style={{ width: '23px' }} target='_blank'>
                                            <img src={tiktok} className=' w-100' alt="" />
                                        </a>
                                    </li>
                                    <li className=' mx-1 fs-5 ' title='TwitterX'>
                                        <a href="https://x.com/i/flow/login" className='xy-center text-black' target='_blank'>
                                            <i className="fa-brands fa-x-twitter"></i>
                                        </a>
                                    </li>
                                    <li className=' mx-2 fs-5 xy-center' title='Linkedin'>
                                        <a href="https://www.linkedin.com/" className='xy-center' style={{ color: '#0077B5' }} target='_blank'>
                                            <i className="fa-brands fa-linkedin-in"></i>
                                        </a>
                                    </li>
                                    <li className=' mx-1 fs-5 ' title='YouTube'>
                                        <a href="https://www.youtube.com/" className='xy-center' style={{ color: 'red' }} target='_blank'>
                                            <i className="fa-brands fa-youtube"></i>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>}


                </div>

            </nav>
            {loadingStatus && <LoadingRegister></LoadingRegister>}
        </>

    )
}

export default memo(NavBar);