import cls from './Comment.module.scss'
import deleteIcon from './../../images/icons/delete.svg'
import withoutAva from '../../images/icons/withoutAva.jpg'

const Comment = (props) => {
    console.log(props);
    function handleDeleteButton ()  {
        props.deleteComment()
    }
    return (
        <div id={props.id} className={cls.container}>

            <div className={cls.avatar}>
                <img src={props.avatarUrl ? props.avatarUrl : withoutAva} alt="avatar" />
            </div>
            <div  className={cls.right}>
                <div className={cls.name}>
                    {props.name}
                </div>
                <div className={cls.text}>
                   {props.text}
                </div>
            </div>
            {props.canChange ? (<div className={cls.delete}>
                <button onClick={handleDeleteButton}>
                    <img src={deleteIcon} alt="delete" />
                </button>
            </div>) : ''}

        </div>

    );
}

export default Comment


