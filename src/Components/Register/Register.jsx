import { useFormik } from 'formik'
import './Register.css'
import { useState } from 'react';
import * as Yup from 'yup'
import axios from 'axios';
import LoadingRegister from '../Loading register/LoadingRegister';
import { useNavigate } from 'react-router-dom';
import useNoDark from '../../Hooks/useNoDark';


export default function Register() {

    let {noDark} = useNoDark();

    let [typed, setTyped] = useState({
        name: false,
        email: false,
        password: false,
        rePassword: false,
        phone: false
    });

    let [loadingStatus, setLoadingStatus] = useState(false);
    let [requestWarning, setRequestWarning] = useState({
        message : '', 
        opacity : 1
    });

    const validationSchema = Yup.object({
        name: Yup.string().matches(/^[A-Z][A-Za-z0-9_\s]{7,29}$/, 'Username must start with a capital letter and in range 8 ~ 29 letters.').required(),
        email: Yup.string().matches(/^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/, "The email couldn't start or finish with a dot, shouldn't contain spaces, special chars and The email could contain a double doman.").required(),
        password: Yup.string().matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, "The password has minimum 8 characters at least one uppercase, lowercase, digit and special character.").required(),
        rePassword: Yup.string().oneOf([Yup.ref('password')], "That does not match your password.").required(),
        phone: Yup.string().matches(/^\+?01[0125][0-9]{8}$/, "accept only egypt phone numbers").required()
    });

    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            rePassword: '',
            phone: ''
        },

        validationSchema,

        onSubmit: async function (values) {
            
            try {
                setLoadingStatus(true);
                let response = await axios.post('https://ecommerce.routemisr.com/api/v1/auth/signup', values);
                if(response?.data?.message == "success"){
                    navigate('/login');
                }
                setLoadingStatus(false);
            } catch (error) {
                if(error.response.status == 400){
                    setRequestWarning({message : error.message + '  :(', opacity : 1});
                    setTimeout(()=>{
                        setRequestWarning({message : error.message + '  :(', opacity : 0});
                    }, 5000);
                }
                else{
                    setRequestWarning({message : error.response.data.message, opacity : 1});
                    setTimeout(()=>{
                        setRequestWarning({message : error.response.data.message, opacity : 0});
                    }, 5000);

                }
                
                setLoadingStatus(false);
            }
        }
    });
    
    function formSubmit(event) {
        formik.handleSubmit(event);
        setTyped({
            name: true,
            email: true,
            password: true,
            rePassword: true,
            phone: true
        })
    }

    function inputChange(event) {
        setTyped({ ...typed, [event.target.id]: true });
        formik.handleChange(event);
    }

    function inputBlur(event){
        formik.handleBlur(event);
        setTyped({ ...typed, [event.target.id]: true });
    }

    function isNotValid(value){
        return formik.errors[value] && formik.touched[value] && typed[value];
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
        <section className="register">
            <div className="container py-5">
                <h2 className=' text-capitalize fw-normal'>register now</h2>
                <form action="" className=' py-3' onSubmit={formSubmit}>
                    <div className="form-floating mb-3">
                        <input type="text" className= {`form-control ${isNotValid('name')?'is-invalid':''}`} id="name" placeholder="name@example.com" onChange={inputChange} onFocus={formik.handleBlur} onBlur={inputBlur}/>                                                                                                                                                                                                                                                                                                                                                         
                        <label htmlFor="name">Username</label>
                    </div>
                    {isNotValid('name') ? <div className={`alert alert-danger z-3 py-2 ${noDark}`} role="alert">{formik.errors.name}</div> : ''}

                    <div className="form-floating mb-3">
                        <input type="email" className= {`form-control ${isNotValid('email')?'is-invalid':''}`} id="email" placeholder="name@example.com" onChange={inputChange} onFocus={formik.handleBlur} onBlur={inputBlur}/>
                        <label htmlFor="email">Email</label>
                    </div>
                    {isNotValid('email') ? <div className={`alert alert-danger z-3 py-2 ${noDark}`} role="alert">{formik.errors.email}</div> : ''}

                    <div className="form-floating mb-3">
                        <input type={`${eye.isMove?'text':'password'}`} className= {`form-control ${isNotValid('password')?'is-invalid':''}`} id="password" placeholder="name@example.com" onChange={inputChange} onFocus={formik.handleBlur} onBlur={inputBlur}/>
                        <label htmlFor="password">Password</label>
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
                    {isNotValid('password') ? <div className={`alert alert-danger z-3 py-2 ${noDark}`} role="alert">{formik.errors.password}</div> : ''}

                    <div className="form-floating mb-3">
                        <input type={`${eye.isMove?'text':'password'}`} className= {`form-control ${isNotValid('rePassword')?'is-invalid':''}`} id="rePassword" placeholder="name@example.com" onChange={inputChange} onFocus={formik.handleBlur} onBlur={inputBlur}/>
                        <label htmlFor="rePassword">Repassword</label>
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
                    {isNotValid('rePassword') ? <div className={`alert alert-danger z-3 py-2 ${noDark}`} role="alert">{formik.errors.rePassword}</div> : ''}

                    <div className="form-floating mb-3">
                        <input type="phone" className= {`form-control ${isNotValid('phone')?'is-invalid':''}`} id="phone" placeholder="name@example.com" onChange={inputChange} onFocus={formik.handleBlur} onBlur={inputBlur}/>
                        <label htmlFor="phone">Phone</label>
                    </div>
                    {isNotValid('phone') ? <div className={`alert alert-danger z-3 py-2 ${noDark}`} role="alert">{formik.errors.phone}</div> : ''}

                    <button type='submit' className={`btn text-capitalize d-block ms-auto ${noDark}`}>register</button>
                    

                    {(requestWarning.message)?<div className='request-warning w-50 bg-danger text-white fw-bold 
                    text-capitalize text-center shadow-lg p-3 mx-auto mt-5 rounded' style={{opacity : requestWarning.opacity}}>{requestWarning.message}</div>: ''}
                    
                </form>
            </div>
            {(loadingStatus)?<LoadingRegister></LoadingRegister>:''}
        </section>
    )
}
