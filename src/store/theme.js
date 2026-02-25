import { createSlice } from "@reduxjs/toolkit";

const theme=createSlice({
    name:"theme",
    initialState:{
        mode:"light"
    },
    reducers:{
        toggletheme:(state)=>{
            state.mode = state.mode === 'light' ? 'dark' : 'light';
        }
    }

})
export const {toggletheme}=theme.actions
export default theme.reducer