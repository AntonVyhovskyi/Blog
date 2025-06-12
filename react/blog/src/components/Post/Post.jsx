import cls from './Post.module.scss'
import iconEye from '../../images/icons/eye.png'
import deleteIcon from '../../images/icons/delete.svg'
import redactIcon from '../../images/icons/redact.svg'
import iconComment from '../../images/icons/comment.png'
import { Link } from 'react-router-dom';
import { fetchDeletePost } from '../../redux/slices/posts'
import { useDispatch } from 'react-redux'
import withoutAva from '../../images/icons/withoutAva.jpg'

const Post = (props) => {

   const dispatch = useDispatch()

   function  handleDeletePost  (id)  {
        dispatch(fetchDeletePost(id))
    }
    
    return (
        <div className={cls.container}>
            <Link to={`/posts/${props.id}`}>
                {props.imageUrl ?
                    <div className={cls.image}>
                        <img src={props.imageUrl} alt="" />
                    </div> : ''}
                <div className={cls.info}>
                    <div className={cls.infoTop}>
                        <div className={cls.infoTopAvatar}><img src={props.avatarUrl ? props.avatarUrl : withoutAva} alt="" /></div>
                        <div className={cls.infoTopText}>
                            <div>{props.name}</div>
                            <div>12/03 12:54</div>
                        </div>
                    </div>
                    <div className={cls.infoTitle}>
                        {props.title}
                    </div>
                    <div className={cls.infoTags}>
                        {props.tags.map((tag, index) => (
                            <div key={index}>#{tag}</div>
                        ))}


                    </div>
                    <div className={cls.infoBotton}>
                        <div><div className={cls.infoBottonImage}><img src={iconEye} alt="" /></div><div>{props.views}</div></div>
                        <div><div className={cls.infoBottonImage}><img src={iconComment} alt="" /></div><div>{props.comments.length}</div></div>
                    </div>

                    
                </div>
            </Link>
            {
                props.canChange ? (
                    <div className={cls.buttons}>
                    <button ><Link to={`/updatepost/${props.id}`}><img src={redactIcon} alt="redact article" /></Link></button>
                    <button onClick={()=>{handleDeletePost(props.id)}} ><img src={deleteIcon} alt="remove article" /></button>
                </div>
                ): ''
            }
           
        </div>
    );
}

export default Post;