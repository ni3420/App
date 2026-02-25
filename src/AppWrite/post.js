import {Client,Databases,Storage,ID} from "appwrite"
import { confi } from "../confi/confi";
 class Post{
    cilent;
    database;
    storage;
    constructor()
    {
        this.cilent=new Client()
        .setEndpoint(confi.AppWrite)
        .setProject(confi.ProjectId)
        this.database=new Databases(this.cilent)
        this.storage=new Storage(this.cilent)
    }
    async CreatePost(data)
    {
        try {
            const post=await this.database.createDocument({
                databaseId:confi.DatabseId,
                collectionId:confi.CollectionId,
                documentId:ID.unique(),
                data:data
            })
            if(post)
            {
                return post
            }
        } catch (error) {
        console.log("AppWrite Based",error)
        console.error(error)
        throw error
            
        }
    }
    async ListPost()
    {
        try {
            const post=await this.database.listDocuments({
                databaseId:confi.DatabseId,
                collectionId:confi.CollectionId
            })
            return post
        } catch (error) {
            console.log("Appwrite error",error)
            throw error
            
        }
    }

    async UpdatePost(data,id)
    {
        try {
            const post=await this.database.updateDocument({
                databaseId:confi.DatabseId,
                collectionId:confi.CollectionId,
                documentId:id,
                data:data
            })
            if(post)
            {
                return post
            }
        } catch (error) {
        console.log("AppWrite Based",error)
        console.error(error)
        throw error
            
        }
    }

    async DeletePost(id)
    {
        try {
            const post=await this.database.deleteDocument({
                databaseId:confi.DatabseId,
                collectionId:confi.CollectionId,
                documentId:id,
            })
            if(post)
            {
                return post
            }
        } catch (error) {
        console.log("AppWrite Based",error)
        console.error(error)
        throw error
            
        }
    }

    
    async ReadPost(id)
    {
        try {
            const post=await this.database.getDocument({
                databaseId:confi.DatabseId,
                collectionId:confi.CollectionId,
                documentId:id,
            })
            if(post)
            {
                return post
            }
        } catch (error) {
        console.log("AppWrite Based",error)
        console.error(error)
        throw error
            
        }
    }

     ImagePost(id)
    {
        return this.storage.getFileView(id)     
    }


    


}

export const postservice=new Post()
export default postservice