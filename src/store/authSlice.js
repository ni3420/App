import {createSlice} from "@reduxjs/toolkit"
const authslice=createSlice({
    name:"auth",
    initialState:{
        status:false,
        userData:null
    },
    reducers:{
        Login:(state,action)=>{
            state.status=true
            state.userData=action.payload

        },
        Logout:(state)=>{
            state.status=false
            state.userData=null

        }
    }

})
export const {Login,Logout}=authslice.actions
export default authslice.reducer