import {Client,Databases,Storage,Query,ID} from "appwrite"
import { confi } from "../confi/confi";
import { AwardIcon } from "lucide-react";
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
    async CreatePost({ title, image, userId, username, status }) {
    try {
        const documentData = {
            title,
            image,
            userId,
            username,
            status: status || "active",
        };

        const post = await this.database.createDocument(
            confi.DatabseId,
            confi.CollectionId,
            ID.unique(),
            documentData
        );

        return post;
    } catch (error) {
        console.error("Appwrite Service :: CreatePost :: Error", error);
        throw error; // Rethrow so the component can handle the error state
    }
}
    async ListPost()
    {
        try {
            const post=await this.database.listDocuments(
                confi.DatabseId,
                confi.CollectionId,
               
            [
                // This line ensures the newest posts come first
                Query.orderDesc("$createdAt"), 
                Query.limit(20) // Optional: limit results for better performance
            ]
            )
            return post
        } catch (error) {
            console.log("Appwrite error",error)
            throw error
            
        }
    }

    async UpdatePost(id, { title, content, image, status }) {
    try {
        // Only pass attributes that exist in your Appwrite Collection schema
        const updateData = {};
        if (title) updateData.title = title;
        if (content) updateData.content = content;
        if (image !== undefined) updateData.image = image; // Can be null if removing image
        if (status) updateData.status = status;

        const post = await this.database.updateDocument(
            confi.DatabseId,
            confi.CollectionId,
            id,
            updateData
        );
        
        return post;
    } catch (error) {
        console.error("AppWrite Service :: UpdatePost :: error", error);
        throw error;
    }
}

// Helper to delete the file from storage bucket
async deleteFile(fileId) {
    try {
        await this.storage.deleteFile(
            confi.BucketId,
            fileId
        );
        return true;
    } catch (error) {
        console.error("AppWrite Service :: deleteFile :: error", error);
        return false;
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
        if(!id)
        {
            return
        }
        return this.storage.getFileView(confi.BucketId,id)     
    }


    async uploadfile(file){
        try {
            if (!file) {
            console.warn("ImagePost called without a fileId");
            return null; 
        }
            return await this.storage.createFile(confi.BucketId,ID.unique(),file)
        } catch (error) {
            console.log(error)
            
        }
    }


    


}

export const postservice=new Post()
export default postservice