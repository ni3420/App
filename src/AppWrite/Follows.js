import { Client,Databases,Query ,ID} from "appwrite";
import { confi } from "../confi/confi";

class follows{
    client;
    database;
    constructor()
    {
        this.client=new Client()
        .setEndpoint(confi.AppWrite)
        .setEndpoint(confi.ProjectId)
        this.database=new Databases(this.client)
    }

    


    async toggleFollow(followerId, followingId) {
        try {
            const existing = await this.database.listDocuments(confi.DatabseId, confi.Follows, [
                Query.equal("followerId", followerId),
                Query.equal("followingId", followingId)
            ]);

            if (existing.total > 0) {
                await this.database.deleteDocument(confi.DatabseId, confi.Follows, existing.documents[0].$id);
                return { status: "unfollowed" };
            } else {
                await this.database.createDocument(confi.DatabseId, confi.Follows, ID.unique(), {
                    followerId,
                    followingId,
                    createdAt: new Date().toISOString()
                });
                return { status: "followed" };
            }
        } catch (error) {
            console.error("FollowService :: toggleFollow :: error", error);
        }
    }

    async getFollowers(userId) {
        return await this.database.listDocuments(confi.DatabseId, confi.Follows, [
            Query.equal("followingId", userId)
        ]);
    }

    async getFollowing(userId) {
        return await this.database.listDocuments(confi.DatabseId, confi.Follows, [
            Query.equal("followerId", userId)
        ]);
    }

    async isFollowing(followerId, followingId) {
        const res = await this.database.listDocuments(confi.DatabseId, confi.Follows, [
            Query.equal("followerId", followerId),
            Query.equal("followingId", followingId)
        ]);
        return res.total > 0;
    }

     
}

export const followsevice=new follows()
export default followsevice



