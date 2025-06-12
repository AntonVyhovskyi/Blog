import cls from './Header.module.scss'
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { authReducer, logout, selectIsAuth, selectUserData } from '../../redux/slices/auth';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import withoutAva from '../../images/icons/withoutAva.jpg'

const Header = () => {

    const dispatch = useDispatch();
    

    const [exitStatus, setExitStatus] = useState(false)
    const hundleSetExitStatus = (status) => {
        setExitStatus(status)
    }

    const hundleLogOut = () => {
        dispatch(logout())
        setExitStatus(false)
        window.localStorage.removeItem('token')
    }


    const userData = useSelector(selectUserData)
   
    const isAuth = useSelector(selectIsAuth)
    return (
        <header>
            <div className={cls.container}>
                <div className={cls.logo}>
                    <Link to="/">toto<span>Blog</span></Link>
                </div>

               {isAuth ?  (<Link to={`/profile/${userData._id}`} className={cls.middle}>
                    <div className={cls.avatar}>
                        <img src={userData.avatarUrl ? userData.avatarUrl : withoutAva} alt="Your avatar" />
                    </div>
                    <div className={cls.name}>{userData.fullName} </div>
                </Link>) : ''}


                {isAuth ?
                    <div>
                        <Link to="/addpost">
                            <Button variant="contained">write article</Button>
                        </Link>
                        {exitStatus ? (
                            <>
                                <Button variant="outlined" onClick={()=>hundleLogOut()}>I'm sure</Button>
                                <Button variant="outlined"  onClick={()=>hundleSetExitStatus(false)}>I changed my mind</Button>
                            </>

                        ) :
                            <Button variant="outlined" onClick={()=>hundleSetExitStatus(true)}>Log out</Button>
                        }


                    </div> :
                    <div>
                        <Link to="/login">
                            <Button variant="outlined">Log in</Button>
                        </Link>
                        <Link to="/registration">
                            <Button variant="contained">Registration</Button>
                        </Link>
                    </div>

                }


            </div>
        </header>
    );
}

export default Header;