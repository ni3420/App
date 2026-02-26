import React from 'react'
import { Route, Routes } from 'react-router-dom'
import MainLayout from './Components/MainLayout'
import LoginPage from './Pages/LoginPage'
import AuthLayout from "./Components/AuthLayout"
import Sign_up from "./Pages/Sign_up"
import AllPost from "./PostPages/AllPost"
import CreatePost from "./PostPages/CreatePost"
import UpdatePost from "./PostPages/UpdatePost"
import MyProfilePage from './Pages/MyProfilePage'
import UserProfile from './Pages/UserProfile'
import Messages from "./Pages/Messages"
import Editprofilepage from './Pages/Editprofilepage'
import Not_Found from './Pages/Not_Found'
import { Toaster } from 'react-hot-toast';
const App = () => {
  return (

    <>
    <Toaster position="top-center" reverseOrder={false} />
    <Routes>
    <Route path="/login" element={<AuthLayout Authentication={false}><LoginPage /></AuthLayout>} />
    <Route path="/signup" element={<AuthLayout Authentication={false}><Sign_up /></AuthLayout>} />

    <Route path="/" element={<AuthLayout ><MainLayout /></AuthLayout>}>
        <Route index element={<AllPost />} /> 
        <Route path='all_post' element={<AllPost />} />
        <Route path='create_post' element={<CreatePost />} />
        <Route path='update_post/:id' element={<UpdatePost />} />
        <Route path="my_profile/:name/:id" element={<MyProfilePage />} />
        <Route path='messages' element={<Messages />} />
        <Route path='edit_profile/:name/:id' element={<Editprofilepage />} />
        <Route path='user_profile/:name/:id' element={<UserProfile />} />
    </Route>

    <Route path="*" element={<Not_Found />} />
</Routes></>
    
  )
}

export default App