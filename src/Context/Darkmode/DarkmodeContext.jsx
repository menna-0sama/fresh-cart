import './DarkmodeContext.css'


import { createContext, useState } from 'react'

export let NoDark = createContext();

export default function DarkmodeContext({children}) {

    let storage={
        dark : false, 
        noDark : ''
    };

    if(localStorage.getItem('darkmode') != null){
        storage.dark = true;
        storage.noDark = 'no-dark';
    }

    let [dark, setDark] = useState(storage.dark);

    let [noDark, setNoDark] = useState(storage.noDark);


    return (
        <NoDark.Provider value={{dark, setDark, noDark, setNoDark}}>
            {children}
        </NoDark.Provider>
    )
}
