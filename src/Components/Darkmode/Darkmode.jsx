import { useEffect, useState } from 'react';
import useNoDark from '../../Hooks/useNoDark'
import './Darkmode.css'

export default function Darkmode() {

    let {dark, setDark, setNoDark} =  useNoDark();
    
    let [drag, setDrag] = useState(false);
    console.log(drag);
    
    let [client, setClient] = useState({})

    function handleDark(){
        
        if(!dark){
            setNoDark('no-dark');
            localStorage.setItem('darkmode' , 'true');
        }
        else{
            setNoDark('dark');
            localStorage.removeItem('darkmode');
        }
        setDark(!dark);
    }

    function dragEvent(event){
        setClient({
            right : window.innerWidth - event.clientX - 40,
            bottom : window.innerHeight - event.clientY  - 40
        })
    }

    useEffect(()=>{
        if(drag){
            window.addEventListener('mousemove', dragEvent);
            document.body.style.cssText = 'user-select: none;'
        }
        
        else{
            window.removeEventListener('mousemove', dragEvent);
            document.body.style.cssText = 'user-select: auto;'
            
        }
        
        return ()=>{
            window.removeEventListener('mousemove', dragEvent);
            document.body.style.cssText = 'user-select: auto;'
        }
    }, [drag]);

    return (
        <>
            <div className={`dark-overlay ${dark?'dark':''}`} style={{...client, transition : drag?'0s':''}}></div>
            <div className='darkmode'  onDoubleClick={handleDark} style={client} onMouseDown={()=>setDrag(true)} onMouseUp={()=>setDrag(false)}>
                <div className='dark-box' style={{transform : dark?'translateY(-50%)':''}}>
                    <span>
                        <i className="fa-solid fa-sun" />
                    </span>
                    <span>
                        <i className="fa-solid fa-moon" />
                    </span>
                </div>
            </div>
        </>
    )
}
