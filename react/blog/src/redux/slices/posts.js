import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    const { data } = await axios.get('/posts');
    return data;
})

export const fetchPostsPopular = createAsyncThunk('posts/fetchPostsPopular', async () => {
    const { data } = await axios.get('/posts/popular');
    return data
})
export const fetchTags = createAsyncThunk('posts/fetchTags', async () => {
    const { data } = await axios.get('/posts/tags');
    return data;
})

export const fetchComments = createAsyncThunk('posts/fetchComments', async () => {
    const { data } = await axios.get('/comments/four');
    return data;
})

export const fetchDeletePost = createAsyncThunk('posts/fetchDeletePost', async (id) => {
    const { data } = await axios.delete(`/posts/${id}`);
    return data;
})

export const fetchDeletePostPopular = createAsyncThunk('posts/fetchDeletePostPopular', async (id) => {
    const { data } = await axios.delete(`/posts/${id}`);
    return data;
})

export const fetchTagPosts = createAsyncThunk('posts/fetchTagPosts', async (id) => {
    const { data } = await axios.get(`/posts/tagpopular/${id}`);
    return data;
})
export const fetchTagPostsNew = createAsyncThunk('posts/fetchTagPostsNew', async (id) => {
    const { data } = await axios.get(`/posts/tagnew/${id}`);
    return data;
})


export const fetchPostsByUser = createAsyncThunk('posts/fetchPostsByUser', async (id) => {
    const { data } = await axios.get(`/posts/user/${id}`);
    return data;
})



const initialState = {
    posts: {
        items: [],
        status: 'loading',
    },
    tags: {
        items: [],
        status: 'loading',
    },
    tagPosts: {
        items: [],
        status: 'loading',
    },
    comments: {
        items: [],
        status: 'loading',
    },

}

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder

            // get posts
            .addCase(fetchPosts.pending, (state) => {
                state.posts.items = [];
                state.posts.status = 'loading';
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {

                state.posts.items = action.payload;
                state.posts.status = 'loaded';
            })
            .addCase(fetchPosts.rejected, (state) => {
                state.posts.items = [];
                state.posts.status = 'error';
            })



            // get popular posts


            .addCase(fetchPostsPopular.pending, (state) => {
                state.posts.items = [];
                state.posts.status = 'loading';
            })
            .addCase(fetchPostsPopular.fulfilled, (state, action) => {
                state.posts.items = action.payload;
                state.posts.status = 'loaded';
            })
            .addCase(fetchPostsPopular.rejected, (state) => {
                state.posts.items = [];
                state.posts.status = 'error';
            })

             // get posts by user


             .addCase(fetchPostsByUser.pending, (state) => {
                state.posts.items = [];
                state.posts.status = 'loading';
            })
            .addCase(fetchPostsByUser.fulfilled, (state, action) => {
                state.posts.items = action.payload;
                state.posts.status = 'loaded';
            })
            .addCase(fetchPostsByUser.rejected, (state) => {
                state.posts.items = [];
                state.posts.status = 'error';
            })


            // get tags

            .addCase(fetchTags.pending, (state) => {
                state.tags.items = [];
                state.tags.status = 'loading';
            })
            .addCase(fetchTags.fulfilled, (state, action) => {

                state.tags.items = action.payload;
                state.tags.status = 'loaded';
            })
            .addCase(fetchTags.rejected, (state) => {
                state.tags.items = [];
                state.tags.status = 'error';
            })


            // get comments -------------------------------
            
            .addCase(fetchComments.pending, (state) => {
                state.comments.items = [];
                state.comments.status = 'loading';
            })
            .addCase(fetchComments.fulfilled, (state, action) => {

                state.comments.items = action.payload;
                state.comments.status = 'loaded';
            })
            .addCase(fetchComments.rejected, (state) => {
                state.comments.items = [];
                state.comments.status = 'error';
            })


            // remove Post 
            .addCase(fetchDeletePost.pending, (state) => {
                state.posts.status = 'loading';
            })
            .addCase(fetchDeletePost.fulfilled, (state, action) => {

                state.posts.items = state.posts.items.filter(e => e._id !== action.meta.arg);
                console.log(action);
                state.posts.status = 'loaded';
            })
            .addCase(fetchDeletePost.rejected, (state) => {
                state.posts.status = 'error';
            })

            // get tag posts


            .addCase(fetchTagPosts.pending, (state) => {
                state.tagPosts.items = [];
                state.tagPosts.status = 'loading';
            })
            .addCase(fetchTagPosts.fulfilled, (state, action) => {

                state.tagPosts.items = action.payload;
                state.tagPosts.status = 'loaded';
            })
            .addCase(fetchTagPosts.rejected, (state) => {
                state.tagPosts.items = [];
                state.tagPosts.status = 'error';
            })

            // get tag posts new


            .addCase(fetchTagPostsNew.pending, (state) => {
                state.tagPosts.items = [];
                state.tagPosts.status = 'loading';
            })
            .addCase(fetchTagPostsNew.fulfilled, (state, action) => {

                state.tagPosts.items = action.payload;
                state.tagPosts.status = 'loaded';
            })
            .addCase(fetchTagPostsNew.rejected, (state) => {
                state.tagPosts.items = [];
                state.tagPosts.status = 'error';
            })




    },
})

export const postsReducer = postsSlice.reducer;