import {Client,Databases,ID,Query} from "appwrite"
import { confi } from "../confi/confi";
class Like{
    client;
    database;
    constructor()
    {
        this.client=new Client()
        .setEndpoint(confi.AppWrite)
        .setProject(confi.ProjectId)
        this.database=new Databases(Client)
    }
    


    async togglePostLike(postId, userId) {
        try {
            const existing = await this.database.listDocuments(confi.DatabseId, confi.Likes, [
                Query.equal("postId", postId),
                Query.equal("userId", userId)
            ]);

            if (existing.total > 0) {
                await this.database.deleteDocument(confi.DatabseId, confi.Likes, existing.documents[0].$id);
                return { action: "unliked" };
            } else {
                return await this.database.createDocument(confi.DatabseId, confi.Likes, ID.unique(), {
                    postId: postId,
                    userId: userId,
                    createdAt: new Date().toISOString()
                });
            }
        } catch (error) {
            console.error("LikeService :: togglePostLike :: error", error);
            throw error;
        }
    }

    async getLikeCount(postId) {
        try {
            const res = await this.database.listDocuments(confi.DatabseId,confi.Likes, [
                Query.equal("postId", postId),
                Query.limit(0)
            ]);
            return res.total;
        } catch (error) {
            console.error("LikeService :: getLikeCount :: error", error);
            return 0;
        }
    }

    async isPostLikedByUser(postId, userId) {
        try {
            const res = await this.database.listDocuments(confi.DatabseId, confi.Likes, [
                Query.equal("postId", postId),
                Query.equal("userId", userId)
            ]);
            return res.total > 0;
        } catch (error) {
            console.log(error)
            return false
        
        }
    }

}



