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

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<MainLayout/>}>
      <Route path="/login" element={<AuthLayout Authentication={false}><LoginPage/></AuthLayout>}/>
      <Route path="/signup" element={<AuthLayout Authentication={false}><Sign_up/></AuthLayout>}/>
      <Route path='/all_post' element={<AllPost/>} />
      <Route path='/create_post' element={<CreatePost/>}/>
      <Route path='/update_post' element={<UpdatePost/>}/>
      <Route path="/my_profile/:id" element={<MyProfilePage/>}/>
      <Route path='/user_profile' element={<UserProfile/>}/>
      <Route path='/messages' element={<Messages/>}/>
      

      
      </Route>
    </Routes>
  )
}

export default App