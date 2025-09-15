import useNoDark from '../../Hooks/useNoDark'
import './ApiLoading.css'


export default function ApiLoading({grayed}) {

    let {noDark} = useNoDark();
    
    return (
        <section className='api-loading  d-flex xy-center' style={grayed&&grayed}>
            <div className={`sk-chase ${noDark}`}>
                <div className="sk-chase-dot" />
                <div className="sk-chase-dot" />
                <div className="sk-chase-dot" />
                <div className="sk-chase-dot" />
                <div className="sk-chase-dot" />
                <div className="sk-chase-dot" />
            </div>
        </section>


    )
}
