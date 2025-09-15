import error404 from '../../assets/404.png'


export default function NotFound() {
    return (
        <section className="not-found py-5">
            <div className="container">
                <img src={error404} className=' w-100' alt="" />
            </div>
        </section>
    )
}
