import { useFormik } from 'formik'
import './Login.css'
import LoadingRegister from '../Loading register/LoadingRegister'
import { useContext, useState } from 'react';
import axios from 'axios';
import * as Yup from 'yup'
import { Link, useNavigate } from 'react-router-dom';
import { authentication } from '../../Context/Authentication/AuthenticationContext';
import useNoDark from '../../Hooks/useNoDark';

export default function Login() {
    
    let {noDark} = useNoDark();

    let [loadingStatus, setLoadingStatus] = useState(false);
    let [requestWarning, setRequestWarning] = useState({
        message: '',
        opacity: 1
    });

    const validationSchema = Yup.object({
        email: Yup.string().required(),
        password: Yup.string().required()
    });

    let navigate = useNavigate();

    let { setIsLogin} = useContext(authentication);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },

        validationSchema,

        onSubmit: async function (values) {

            try {
                setLoadingStatus(true);
                let response = await axios.post('https://ecommerce.routemisr.com/api/v1/auth/signin', values);
                if (response?.data?.message == "success" || response.status == 200) {
                    localStorage.setItem('user1', response.data.token);
                    setIsLogin(true);
                    navigate('/');
                }
                setLoadingStatus(false);
            } catch (error) {
                setLoadingStatus(false);
                if (error.response.status == 400) {
                    setRequestWarning({
                        message: error.response.data.errors.msg,
                        opacity: 1
                    });

                    setTimeout(() => {
                        setRequestWarning({
                            message: error.response.data.errors.msg,
                            opacity: 0
                        });
                    }, 5000);
                }
                else {
                    setRequestWarning({
                        message: error.response.data.message,
                        opacity: 1
                    });

                    setTimeout(() => {
                        setRequestWarning({
                            message: error.response.data.message,
                            opacity: 0
                        });
                    }, 5000);

                }
            }

        }
    });

    function isNotValid(value) {
        return formik.errors[value] && formik.touched[value];
    }

    let [eye, setEye] = useState({
        color : 'red', 
        isMove : false
    });

    function eyeMove(){
        if(eye.isMove){
            setEye({
                color : 'red', 
                isMove : false
            })
        }
        else{
            setEye({
                color : 'green', 
                isMove : true
            })

        }
    }



    return (
        <section className='login'>
            <div className="container py-5">
                <h2 className='fw-normal mb-4'>Log in</h2>
                <form action="" className='py-3' onSubmit={formik.handleSubmit}>
                    <div className={` position-relative mb-4`}>
                        <label htmlFor="email" className=' text-secondary text-capitalize px-3 position-absolute bg-white rounded '>email</label>
                        <input type="email" id='email' className=' form-control border border-2' onChange={formik.handleChange} onBlur={formik.handleBlur} />
                    </div>
                    {isNotValid('email') ? <div className={`alert alert-danger mb-5 ${noDark}`} role="alert">{formik.errors.email}</div> : ''}
                    <div className={` position-relative mb-4`}>
                        <label htmlFor="password" className=' text-secondary text-capitalize px-3 position-absolute bg-white rounded'>password</label>
                        <input type={`${eye.isMove?'text':'password'}`} id='password' className=' form-control border border-2' onChange={formik.handleChange} onBlur={formik.handleBlur} />
                        <div className={`eye position-absolute rounded-pill p-1 ${eye.color} ${noDark}`}>
                            <span className=' d-inline-flex w-50 rounded-circle  xy-center' style={{height : '22.5px'}}>
                                <i className="fa-solid fa-eye" />
                            </span>
                            <span className=' d-inline-flex w-50 rounded-circle  xy-center' style={{height : '22.5px'}}>
                                <i className="fa-solid fa-eye-slash"></i>
                            </span>
                            <div className={` position-absolute bg-white rounded-circle ${eye.isMove&&'move'}`} style={{height : '22.5px'}} onClick={eyeMove}></div>
                        </div>
                    </div>
                    {isNotValid('password') ? <div className={`alert alert-danger mb-5 ${noDark}`} role="alert">{formik.errors.password}</div> : ''}
                    <div className=' d-flex align-items-start flex-wrap'>
                        <div className='help '>
                            <p className='mb-2'>Don&apos;t have an account 
                                <Link to="/register" className={` ms-1 ${noDark}`}>Register</Link>
                            </p>
                            <p className='mb-0'>Forget your password
                                <Link to="/resetPassword" className={` ms-1 ${noDark}`}>Reset</Link>
                            </p>
                        </div>
                        <button type='submit' className={`btn d-block ms-auto mb-4 ${noDark}`}>Log in</button>
                    </div>
                    {requestWarning.message ? <div className={`request-warning w-50 bg-danger text-white fw-bold 
                        text-center shadow-lg p-3 mx-auto mt-5 rounded ${noDark}`} style={{ opacity: requestWarning.opacity }}>{requestWarning.message}</div> : ''}

                </form>
            </div>
            {loadingStatus ? <LoadingRegister></LoadingRegister> : ''}

        </section>
    )
}
