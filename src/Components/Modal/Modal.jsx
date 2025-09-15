import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './Modal.css'
import { useFormik } from 'formik';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import useNoDark from '../../Hooks/useNoDark';

export default function ModalPayment({button, cartId}) {

    let {noDark} = useNoDark();

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const token = localStorage.getItem('user1');

    function paymentCheckout({cartId, values}){
        
        return axios.post(`https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartId}?url=http://localhost:5174`, 
            {
                shippingAddress : values
            },
            {
                headers : {
                    token
                }
            }
        )
    }
    function paymentCash({cartId, values}){
        
        return axios.post(`https://ecommerce.routemisr.com/api/v1/orders/${cartId}`, 
            {
                shippingAddress : values
            },
            {
                headers : {
                    token
                }
            }
        )
    }

    let {mutate : mutateOnline, data : online, isError : isErrorOnline, error : errorOnline, isSuccess : isSuccessOnline} = useMutation({mutationFn : paymentCheckout});
    let {mutate : mutateCash, data : cash, isError : isErrorCash , error : errorCash, isSuccess : isSuccessCash} = useMutation({mutationFn : paymentCash});

    if(isSuccessOnline){
        window.location.href = online.data.session.url;
    }

    if(isSuccessCash){
        console.log(cash);
        
    }

    const formik = useFormik({
        initialValues : {
            details : '',
            phone : '',
            city : ''
        },
        onSubmit : (values)=>{
            if(button == 'online'){
                mutateOnline({ cartId, values});
            }
            else if(button == 'cash'){
                mutateCash({ cartId, values});
            }
            
        }       
    })

    return (
        <>
            <Button className={`btn-online me-3 ${noDark}`} variant="primary" onClick={handleShow}>
                Pay {button}
            </Button>
            {isErrorOnline?errorOnline.message:''}
            {isErrorCash?errorCash.message:''}

            <Modal show={show} onHide={handleClose} className={`modal`}>
                <Modal.Header closeButton className=''> 
                </Modal.Header>
                <Modal.Body>
                    <form action="" onSubmit={formik.handleSubmit}>
                        <label htmlFor="details">Details</label>
                        <input type="text" className={` form-control mb-3 ${noDark}`} id="details" onChange={formik.handleChange} />

                        <label htmlFor="phone">City</label>
                        <input type="text" className={` form-control mb-3 ${noDark}`} id="phone"  onChange={formik.handleChange}/>
                        
                        <label htmlFor="city">Phone</label>
                        <input type="text" className={` form-control ${noDark}`} id="city"  onChange={formik.handleChange} />  
                        
                        <Modal.Footer className=' mt-4 py-2 px-0'>
                            <button  type='submit' className={`btn-submit p-2 ${noDark}`} >
                                Submit
                            </button>
                        </Modal.Footer>

                    </form>
                </Modal.Body>
            </Modal>
        </>
    );
}

