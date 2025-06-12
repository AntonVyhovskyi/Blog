
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import AddPost from './components/AddPost/AddPost';
import FullPost from './components/FullPost/FullPost';
import Home from './components/Home/Home';
import TagPosts from './components/TagPosts/TagPosts';
import Login from './components/Login/Login';
import Registration from './components/Registration/Registration';
import Header from './components/header/Header';
import { Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import { fetchUserDataMe, selectIsAuth } from './redux/slices/auth';
import Profile from './components/Profile/Profile';
import UpdateProfile from './components/UpdateProfile/UpdateProfile';



function App() {
  const dispatch = useDispatch()
  const isAuth = useSelector(selectIsAuth)

  useEffect(()=>{
    dispatch(fetchUserDataMe())
  },[])

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/posts/:id" element={<FullPost/>} />
        <Route path="/addpost" element={<AddPost/>} />
        <Route path="/updatepost/:id" element={<AddPost/>} />
        <Route path="/tagPosts/:tag" element={<TagPosts/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/registration" element={<Registration/>} />
        <Route path="/profile/:id" element={<Profile/>} />
        <Route path="/updateProfile" element={<UpdateProfile/>} />

      </Routes>
    </div>
  );
}

export default App;
