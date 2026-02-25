import React, { useEffect,  } from 'react'
import { useSelector } from "react-redux"
import { useNavigate, Outlet } from "react-router-dom"

const AuthLayout = ({ Authentication = true ,children}) => {
    const navigate = useNavigate()
    const authStatus = useSelector(state => state.auth.status)

    useEffect(() => {
        if (Authentication && authStatus !== Authentication) {
            navigate("/login")
        } 
        else if (!Authentication && authStatus !== Authentication) {
            navigate("/")
        }
        
    }, [Authentication, authStatus, navigate])
return <>{children}</>
}

export default AuthLayout