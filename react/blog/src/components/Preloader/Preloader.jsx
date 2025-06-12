import cls from './Preloader.module.css'

const Preloader = () => {
    return ( 
        <div className={cls.preloaderContainer}>
            <div></div>
            <div></div>
            <div></div>
        </div>
     );
}
 
export default Preloader;