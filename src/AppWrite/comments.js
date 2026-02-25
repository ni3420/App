import {Client,Databases, ID,Query} from "appwrite"
import { confi } from "../confi/confi";

class comments{
    client;
    database;
    constructor()
    {
        this.client=new Client()
        .setEndpoint(confi.AppWrite)
        .setProject(confi.ProjectId)
        this.database=new Databases(this.client)
    }
    async createComment(data)
    {
        try {
            const comment=await this.database.createDocument({
                databaseId:confi.DatabseId,
                collectionId:confi.Comments,
                documentId:ID.unique(),
                data:data

            })
            return comment
        } catch (error) {
           console.log("AppWrite error",error)
           throw error 
        }
    }

    async getComments(postId)
    {
        try {
            const comment=await this.database.listDocuments(
                confi.DatabseId,
                confi.Comments,[
                    Query.equal("postId", postId),
            Query.orderDesc("timestamp")
        ])
            
            return comment
        } catch (error) {
            console.log("AppWrite error",error)
            throw error
            
        }
    }
}

export const CommentService=new comments()
export default CommentService


