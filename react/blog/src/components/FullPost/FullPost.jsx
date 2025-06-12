import cls from './FullPost.module.scss'
import iconEye from '../../images/icons/eye.png'
import iconComment from '../../images/icons/comment.png'
import { useEffect, useState } from 'react'
import axios from '../../axios'
import { Link, useParams } from 'react-router-dom'
import moment from 'moment'
import Preloader from '../Preloader/Preloader'
import Comment from '../Comment/Comment'
import { useSelector } from 'react-redux'
import { TextField } from '@mui/material'
import Button from '@mui/material/Button';
import withoutAva from '../../images/icons/withoutAva.jpg'




const FullPost = () => {
    const id = useParams().id
    const [loading, setLoading] = useState(true)
    const [state, getState] = useState([])
    const [newCommentText, setNewCommentText] = useState('')
    const [anchor, setAnchor] = useState('');



    useEffect(() => {
        axios.get(`/posts/${id}`).then((res) => {
            getState(res.data)
            console.log(res.data);
            setLoading(false)
            const url = window.location.href;
            const anchorIndex = url.indexOf('#');
            if (anchorIndex !== -1) {
                const anchorValue = url.substring(anchorIndex + 1);
                setAnchor(anchorValue);
                
            }
        })


    }, [])

   

    useEffect(() => {
        const element = document.getElementById(anchor);
    
        
        if (element) {
         
          element.scrollIntoView({ behavior: 'smooth' });
        }


    }, [anchor])

    
    const { data } = useSelector(state => state.auth)
    const deleteComment = async (commentid) => {
        try {
            console.log(commentid);

            await axios.delete('/comments', { data: { id: commentid } });

            const response = await axios.get(`/posts/${id}`);
            getState(response.data);
            console.log(response.data);

            setLoading(false);
        } catch (error) {
            console.error('Error deleting comment:', error);

            setLoading(false);
        }
    };

    const handleSendComment = async () => {
        try {
            setLoading(true)
            await axios.post('/comments', {
                text: newCommentText,
                postId: id,
            })
            const response = await axios.get(`/posts/${id}`);
            getState(response.data);
            console.log(response.data);
            setNewCommentText('')
            setLoading(false)
        }
        catch (error) {
            console.error('Error add comment:', error);
            setLoading(false);
        }
    }


    function handleSetNewCommentText(e) {
        setNewCommentText(e.target.value)
    }
    if (!loading) {
        return (
            <>
                <div className={cls.container}>
                    {state.imageUrl ? <div className={cls.image}>
                        <img src={state.imageUrl} alt="" />
                    </div> : ''}
                    <div className={cls.info}>
                        <div className={cls.infoTop}>
                            <Link to={`/profile/${state.user._id}`} className={cls.infoTopAvatar}><img src={state.user.avatarUrl ? state.user.avatarUrl : withoutAva} alt="" /></Link>
                            <div className={cls.infoTopText}>
                                <div>{state.user.fullName}</div>
                                <div>{moment(state.createdAt).format('DD.MM.YYYY')} {moment(state.createdAt).format('HH:mm')}</div>
                            </div>
                        </div>
                        <div className={cls.infoTitle}>
                            {state.title}
                        </div>
                        <div className={cls.infoTags}>
                            {state.tags.map((tag, index) => (
                                <div key={index}>#{tag}</div>
                            ))}

                        </div>
                        <div className={cls.text}>
                            <p>
                                {state.text}
                            </p>
                        </div>
                        <div className={cls.infoBotton}>
                            <div><div className={cls.infoBottonImage}><img src={iconEye} alt="" /></div><div>{state.viewsCount}</div></div>
                            <div><div className={cls.infoBottonImage}><img src={iconComment} alt="" /></div><div>{state.comments.length}</div></div>
                        </div>
                    </div>
                </div>

                <div className={cls.container}>
                    <div className={cls.comentsHeader}>{(state.comments.length > 0) ? 'Comments' : 'No comments'}</div>
                    <div className={cls.comments}>
                        {state.comments.map((e, index) => (


                            <Comment key={index}
                                name={e.user.fullName} text={e.text} userId={e.user._id}
                                id={e._id}
                                avatarUrl={e.user.avatarUrl}
                                canChange={data ? e.user._id === data._id : false}
                                deleteComment={() => { deleteComment(e._id) }} />



                        )

                        )}


                    </div>

                </div>

                {data ? (<div className={cls.container}>
                    <div className={cls.formComment}>
                        <div className={cls.formAvatar}>
                            <img src={data.avatarUrl} alt="avatar" />
                        </div>
                        <div className={cls.formMid}>
                            <div className={cls.formMidHeader}>{data.fullName}</div>
                            <div className={cls.formMidText}>
                                <TextField multiline label="New comment" value={newCommentText} onChange={handleSetNewCommentText} />
                            </div>
                        </div>
                        <div className={cls.formCommentButton}>
                            <Button variant="contained" onClick={handleSendComment}>Send</Button>
                        </div>
                    </div>

                </div>) : ''}
            </>
        )
    } else return (<Preloader />)
}

export default FullPost;