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
    async createComment(postId,userId,content)
    {
        try {
            const comment=await this.database.createDocument({
                databaseId:confi.DatabseId,
                collectionId:confi.Comments,
                documentId:ID.unique(),
                data:{
                    postId:postId,
                    userId:userId,
                    content:content,
                    timestamp:new Date().toISOString()


                }

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


    subscribeToComments(callback) {
    return this.client.subscribe(
        `databases.${confi.DatabseId}.collections.${confi.Comments}.documents`,
        (response) => {
            // Check if the event is a 'create' event
            if (response.events.includes("databases.*.collections.*.documents.*.create")) {
                callback(response.payload);
            }
            
            // Optional: You can also handle 'delete' events to remove comments in real-time
            if (response.events.includes("databases.*.collections.*.documents.*.delete")) {
                // You might need a different callback or a status in your payload
                console.log("Comment deleted:", response.payload.$id);
            }
        }
    );
}
}

export const Commentservice=new comments()
export default Commentservice


