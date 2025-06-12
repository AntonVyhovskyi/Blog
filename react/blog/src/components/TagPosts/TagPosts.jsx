import Post from '../Post/Post.jsx';
import cls from './TagPosts.module.scss'

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchComments, fetchTagPosts, fetchTagPostsNew, fetchTags } from '../../redux/slices/posts.js';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Link, useParams } from 'react-router-dom';
import withoutAva from '../../images/icons/withoutAva.jpg'


const TagPosts = () => {


    const dispatch = useDispatch()

    const { tagPosts, tags, comments} = useSelector(state => state.posts)
    const { data } = useSelector(state => state.auth)
    const [sort, setSort] = useState('new')
    

    const handleChangeSort = (event, newValue) => {
        setSort(newValue);
    };

    const { tag } = useParams()

    const postsLoading = tagPosts.status === 'loaded'
    console.log(sort);

    console.log(tag);

    useEffect(

        () => {
            if (sort === 'new') {
                
                dispatch(fetchTagPostsNew(tag))
                dispatch(fetchTags())
                dispatch(fetchComments())

            }
            if (sort === 'popular') {
                

                dispatch(fetchTagPosts(tag))
                dispatch(fetchTags())
                dispatch(fetchComments())
                

            }






        },
        [tag, sort]
    )

    





    return (

        <>
            <div className={cls.container}>
                <Box sx={{ width: '100%' }}>
                    <Tabs
                        value={sort}
                        onChange={handleChangeSort}
                        aria-label="wrapped label tabs example"
                    >
                        <Tab
                            value="new"
                            label="New"
                            wrapped
                        />
                        <Tab value="popular" label="Popular" />
                    </Tabs>
                </Box>
            </div>

            <div className={cls.container}>


                <div className={cls.posts}>
                    {postsLoading ?
                        (
                            <>
                                {(Array.isArray(tagPosts.items) && tagPosts.items.map((e, index) => (
                                    <Post key={index} imageUrl={e.imageUrl} name={e.user.fullName}
                                        title={e.title} tags={e.tags} views={e.viewsCount} id={e._id}
                                        canChange={data?._id === e.user._id} comments={e.comments} avatarUrl={e.user.avatarUrl} />
                                )))


                                }
                            </>
                        ) : ''}
                </div>
                <div className={cls.homeRight}>
                    <div className={cls.tags}>
                        <div>Tags</div>
                        {tags.items.length > 0 ? (tags.items.map((e, index) => (
                            <Link to={`/tagPosts/${e}`} key={index} className={cls.tag}>
                                <div>#</div>
                                <div>{e}</div>
                            </Link>
                        ))) : (<div className={cls.tag}>
                            <div>#</div>
                            <div>loading</div>
                        </div>)}
                    </div>
                    <div className={cls.comments}>
                        <div className={cls.commentsHeader}>Last comments</div>
                        <div className={cls.commentsItems}>


                            {
                                
                                comments.items.length>0 ? (
                                    comments.items.map((e, index) =>(
                                        <Link className={cls.commentItem} key={index} to={`http://localhost:3000/posts/${e.post}#${e._id}`}>
                                        <div className={cls.commentItemAvatar}><img src={e.user.avatarUrl ? e.user.avatarUrl : withoutAva} alt="avatar" /></div>
                                        <div className={cls.commentItemText}>
                                            <div>{e.user.fullName}</div>
                                            <div>{e.text.slice(0, 40)+'...'}</div>
                                        </div>
                                    </Link>
                                    ))
                                ): ''
                            }
                    
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

export default TagPosts;