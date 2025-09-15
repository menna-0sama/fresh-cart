
import { useMutation } from '@tanstack/react-query'
import './ResetPassword.css'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import resetPassword from '../../jsFunctions/Api/resetPassword'
import ApiLoading from '../Api Loading/ApiLoading'
import verifyCode from '../../jsFunctions/Api/verifyCode'
import addNewPassword from '../../jsFunctions/Api/addNewPassword'
import { useNavigate } from 'react-router-dom'
import { NoDark } from '../../Context/Darkmode/DarkmodeContext'
import useNoDark from '../../Hooks/useNoDark'


export default function ResetPassword() {

    let {noDark} = useNoDark();

    let navigate = useNavigate();

    
    let {mutate : mutateEmail,  isPending: isPendingEmail, isSuccess : isSuccessEmail, isError : isErrorEmail, error : errorEmail} = useMutation({
        mutationFn : resetPassword
    });

    
    let {mutate : mutateCode,  isPending : isPendingCode, isSuccess : isSuccessCode, isError : isErrorCode, error : errorCode} = useMutation({
        mutationFn : verifyCode
    });

    
    let {mutate : mutateNew,  isPending : isPendingNew, isSuccess : isSuccessNew, isError : isErrorNew, error : errorNew} = useMutation({
        mutationFn : addNewPassword
    });

    const validationSchemaEmail = Yup.object({
        email : Yup.string().matches(/^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/, "The email couldn't start or finish with a dot, shouldn't contain spaces, special chars and The email could contain a double doman.").required(),
    })

    const formikEmail = useFormik({
        initialValues : {
            email : ''
        }, 
        validationSchema : validationSchemaEmail,
        onSubmit : (values)=>{
            mutateEmail(values);
        }
    });

    if(isSuccessNew){
        navigate('/login');
    }


    const formikCode = useFormik({
        initialValues : {
            resetCode : ''
        }, 
        onSubmit : (values)=>{
            mutateCode(values);
            
        }
    });


    const validationSchemaNew = Yup.object({
        email : Yup.string().matches(/^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/, "The email couldn't start or finish with a dot, shouldn't contain spaces, special chars and The email could contain a double doman.").required(),
        newPassword : Yup.string().matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, "The password has minimum 8 characters at least one uppercase, lowercase, digit and special character.").required(),
    })

    const formikNew = useFormik({
        initialValues : {
            email : '',
            newPassword : ''
        }, 
        validationSchema : validationSchemaNew ,
        onSubmit : (values)=>{
            mutateNew(values);
        }
    });


    return (
        <section className=" reset py-5">
            {!isSuccessEmail?<div className="container">
                {isPendingEmail?<ApiLoading grayed={{width : '100%' , height : '100%', backgroundColor : '#80808082', position : 'fixed', top: '0', left : '0', zIndex : '5000' }} ></ApiLoading> :''}
                
                <h2 className="fw-normal mb-4 text-capitalize">reset password</h2>
                <form action="" onSubmit={formikEmail.handleSubmit}>
                    <label htmlFor="email" className=" mb-1 ms-1">
                        Your email
                    </label>
                    <input type="email" id='email' className=" form-control mb-3" placeholder="Enter Your Email" onChange={formikEmail.handleChange} onBlur={formikEmail.handleBlur}/>
                    {formikEmail.errors.email && formikEmail.touched.email?<div className="alert alert-danger z-3 py-2" role="alert">{formikEmail.errors.email}</div>:''}

                    <button type='submit' className={` btn d-block ms-auto ${noDark}`}>Submit</button>
                    {isErrorEmail?<div className={`alert alert-danger z-3 py-2 mt-2 ${noDark}`} role="alert">{errorEmail.response.data.message}</div>:''}
                    
                </form>
            </div>:''}

            {isSuccessEmail && !isSuccessCode?<div className="container">
                {isPendingCode?<ApiLoading grayed={{width : '100%' , height : '100%', backgroundColor : '#80808082', position : 'fixed', top: '0', left : '0', zIndex : '5000' }} ></ApiLoading> :''}
                
                <h2 className="fw-normal mb-4 text-capitalize">verify reset password</h2>
                <form action="" onSubmit={formikCode.handleSubmit}>
                    <label htmlFor="resetCode" className=" mb-1 ms-1">
                        Rest code
                    </label>
                    <input type="text" id='resetCode' className=" form-control mb-3" placeholder="Enter Rest Code" onChange={formikCode.handleChange} onBlur={formikCode.handleBlur}/>

                    <button type='submit' className={` btn d-block ms-auto ${noDark}`}>Verify</button>
                    {isErrorCode?<div className={`alert alert-danger z-3 py-2 mt-2 ${noDark}`} role="alert">{errorCode.response.data.message}</div>:''}

                </form>
            </div>:''}

            {isSuccessCode?<div className="container">
                {isPendingNew?<ApiLoading grayed={{width : '100%' , height : '100%', backgroundColor : '#80808082', position : 'fixed', top: '0', left : '0', zIndex : '5000' }} ></ApiLoading> :''}
                
                <h2 className="fw-normal mb-4 text-capitalize">Enter your new password</h2>
                <form action="" onSubmit={formikNew.handleSubmit}>
                    <label htmlFor="email" className=" mb-1 ms-1">
                        Email
                    </label>
                    <input type="text" id='email' className=" form-control mb-3" placeholder="Enter Your Email" onChange={formikNew.handleChange} onBlur={formikNew.handleBlur}/>
                    {formikNew.errors.email && formikNew.touched.email?<div className="alert alert-danger z-3 py-2" role="alert">{formikNew.errors.email}</div>:''}
                    
                    <label htmlFor="newPassword" className=" mb-1 ms-1">
                        New password
                    </label>
                    <input type="text" id='newPassword' className=" form-control mb-3" placeholder="Enter Your New Password" onChange={formikNew.handleChange} onBlur={formikNew.handleBlur}/>
                    {formikNew.errors.newPassword && formikNew.touched.newPassword?<div className="alert alert-danger z-3 py-2" role="alert">{formikNew.errors.newPassword}</div>:''}

                    <button type='submit' className={` btn d-block ms-auto ${noDark}`}>Reset</button>
                    {isErrorNew?<div className={`alert alert-danger z-3 py-2 mt-2 ${noDark}`} role="alert">{errorNew.response.data.message}</div>:''}

                </form>
            </div>:''}
            
        </section>
    )
}
