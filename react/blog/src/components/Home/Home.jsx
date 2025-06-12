import Post from '../Post/Post.jsx';
import cls from './Home.module.scss'

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchComments, fetchPosts, fetchPostsPopular, fetchTags } from '../../redux/slices/posts.js';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';
import withoutAva from '../../images/icons/withoutAva.jpg'


const Home = () => {


    const dispatch = useDispatch()

    const { posts, tags, comments } = useSelector(state => state.posts)
    const { data } = useSelector(state => state.auth)
    const [sort, setSort] = useState('new')

    const handleChangeSort = (event, newValue) => {
        setSort(newValue);
    };

    const postsLoading = posts.status === 'loaded'
    console.log(comments);

    useEffect(

        () => {
            if (sort === 'new') {
                dispatch(fetchPosts())
                dispatch(fetchTags())
                dispatch(fetchComments())

            }
            if (sort === 'popular') {
                dispatch(fetchPostsPopular())
                dispatch(fetchTags())
                dispatch(fetchComments())
            }






        },
        [sort]
    )



    const testText = 'lorem asda dsa dsa d asd sa d adsdlorem asda dsa dsa d asd sa d adsdlorem asda dsa dsa d asd sa d adsdlorem asda dsa dsa d asd sa d adsdlorem asda dsa dsa d asd sa d adsd'


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

export default Home;