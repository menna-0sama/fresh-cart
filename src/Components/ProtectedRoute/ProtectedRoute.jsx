import { Navigate } from "react-router-dom"

export default function ProtectedRoute({children}) {


    if(localStorage.getItem('user1') != null){
        return(
            <>
            {children}
            </>
        )
    }
    else{
        return(
            <Navigate to='/login'></Navigate>
        )
    }
    
}
