import { configureStore } from "@reduxjs/toolkit";
import authreducer from "./authSlice"
import themereducer from "./theme"

export const store=configureStore({
    reducer:{
        auth:authreducer,
        theme:themereducer
    }
})