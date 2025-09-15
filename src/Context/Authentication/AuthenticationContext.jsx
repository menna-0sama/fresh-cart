import { createContext, useEffect, useState } from "react";

export let authentication = createContext();

export default function AuthContextProvider({children}){

    let [isLogin, setIsLogin] = useState(false);

    useEffect(()=>{
        if(localStorage.getItem('user1') != null){
            setIsLogin(true);
        }
    }, []);
    
    
    return (
        <>
            <authentication.Provider value={{isLogin, setIsLogin}}>
                {children}
            </authentication.Provider>
        </>
    )
}


