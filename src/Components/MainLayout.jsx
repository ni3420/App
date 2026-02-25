import React, { useEffect } from 'react'
import Header from './Header'
import {  Outlet, useNavigate,  } from 'react-router-dom'
import Footer from './Footer'
import authservice from '../AppWrite/auth'
import { useDispatch,  } from 'react-redux'
import { Login } from '../store/authSlice'

const MainLayout = () => {
    const dispatch=useDispatch()
    const navigate=useNavigate()
    useEffect(()=>{
        const getData=async()=>{
            try {
                const res=await authservice.CurrentUser()
                if(res)
                {
                    dispatch(Login(res))
                    navigate("/all_post")
                    
                    
                }else{
                    navigate("/login")
                    return
                }
            } catch (error) {
              console.log(error)  
            }
        }
        getData()

    },[dispatch])
  return (
    <div>
        <Header/>
        <Outlet/>
        <Footer/>
    </div>
  )
}

export default MainLayout