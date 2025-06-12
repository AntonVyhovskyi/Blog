import { useDispatch, useSelector } from 'react-redux';
import cls from './Profile.module.scss'
import Button from '@mui/material/Button';
import { fetchPosts, fetchPostsByUser } from '../../redux/slices/posts';
import { useEffect, useState } from 'react';
import Post from '../Post/Post';
import { Link, useParams } from 'react-router-dom';
import axios from '../../axios'
import withoutAva from '../../images/icons/withoutAva.jpg'
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    
    const dispatch = useDispatch()
    const { posts } = useSelector(state => state.posts)
    const { data } = useSelector(state => state.auth)
    const { id } = useParams();
    const [userData, setUserData] = useState(null)
    const navigate = useNavigate()
    
    


    const postsLoading = posts.status === 'loaded'

    useEffect(

         () => {
            dispatch(fetchPostsByUser(id))
            axios.get(`/user/${id}`).then((res)=>{
                console.log(res.data);
                setUserData(res.data)
            }).catch((error)=>{
                console.error(error);
                navigate('/')
            })
        },
        [id]
    )
    const isCurrentUser = data && data._id && userData && userData._id && userData._id === data._id;

   if (userData === null) {
    return (
        <div>Loading...</div>
    )
   }

    return (
        <div className={cls.profile}>
            <div className={cls.profileContainer}>
                <div className={cls.profileLeft}>
                    {userData ?  ( <> <div className={cls.profileAvatar}>
                        <img src={userData.avatarUrl ? userData.avatarUrl : withoutAva} alt="avatar" />
                    </div>
                    <div className={cls.profileName}>{userData.fullName}</div>
                    <div className={cls.profileEmail}>{userData.email}</div>
                    {isCurrentUser ? (<Link to='/updateProfile'><Button variant='outlined'>Edit profile</Button> </Link>): ''} </>):
                    ''}
                </div>
                
                <div className={cls.posts}>
                    {postsLoading ?
                        (
                            <>
                                {(Array.isArray(posts.items) && posts.items.map((e, index) => (
                                    <Post key={index} imageUrl={e.imageUrl} name={e.user.fullName}
                                        title={e.title} tags={e.tags} views={e.viewsCount} id={e._id}
                                        canChange={data?._id === e.user._id} comments={e.comments}
                                        avatarUrl={e.user.avatarUrl} />
                                )))


                                }
                            </>
                        ) : ''}
                </div>
            </div>
        </div>
    );
}

export default Profile;
