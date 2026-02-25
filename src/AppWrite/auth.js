import {Client,Account,ID} from "appwrite"
import {confi} from "../confi/confi"
import  { profileservice } from "./profile";
 class Auth{
    client;
    account;
    constructor()
    {
        this.client=new Client()
        .setEndpoint(confi.AppWrite)
        .setProject(confi.ProjectId)
        this.account=new Account(this.client)
    }
    async handleSignUp({fullName,email,password})
    {
        try {
            const user= await this.account.create({
                userId:ID.unique(),
                name:fullName,
                email:email,
                password:password,

            })
            if(user)
            {
               const login=await this.handleSignIn({email,password})
               
                if(login)
                {
                    const pro=await profileservice.createProfile({
                        $id:user.$id,
                        fullname:fullName
                    })
                    if(pro)
                    {
                        console.log(pro)
                        return pro
                    }
                    return login
                    
                }
               console.log("sign up:",user)
                return user
            }
        } catch (error) {
            console.log(error)
            
        }
    }
    
    async handleSignIn({email,password})
    {
        try {
            const user= await this.account.createEmailPasswordSession({
                email:email,
                password:password,

            })
            if(user)

            {
                console.log("login",user)
                return user
            }
        } catch (error) {
            console.log(error)
            
        }
    }
    async handleSignOut()
    {
        try {
            const user= await this.account.deleteSessions()
            if(user)
            {
                return user
            }
        } catch (error) {
            console.log(error)
            
        }
    }
    async CurrentUser()
    {
        try {
            const user= await this.account.get()
            if(user)
            {
                return user
            }
        } catch (error) {
            console.log(error)
            
        }
    }

}

export const authservice=new Auth()
export default authservice