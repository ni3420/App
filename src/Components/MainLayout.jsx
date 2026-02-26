import React, { useEffect } from 'react'
import Header from './Header' // Your NavBar
import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import authservice from '../AppWrite/auth'
import { useDispatch } from 'react-redux'
import { Login } from '../store/authSlice'

const MainLayout = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        const checkUser = async () => {
            try {
                const res = await authservice.CurrentUser()
                if (res) {
                    dispatch(Login(res))
                }
            } catch (error) {
                console.log("MainLayout :: Auth Check Error", error)
            }
        }
        checkUser()
    }, [dispatch])

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            
            {/* flex-grow ensures content pushes footer to the bottom */}
            <main className="flex-grow">
                <Outlet />
            </main>

            <Footer />
        </div>
    )
}

export default MainLayout