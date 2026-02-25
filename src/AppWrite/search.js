import { Client, Databases,Query } from "appwrite"
import { confi } from "../confi/confi";
class search{
    client;
    database;
    constructor()
    {
        this.client=new Client()
        .setEndpoint(confi.AppWrite)
        .setProject(confi.ProjectId)
        this.database=new Databases(this.client)
    }
    
    

    async searchUsers(term) {
        if (!term) return [];
        try {
            const res = await this.database.listDocuments(confi.DatabseId, confi.Profiles, [
                Query.search("fullName", term),
                Query.limit(10)
            ]);
            return res.documents;
        } catch (error) {
            console.error("SearchService :: searchUsers :: error", error);
            return [];
        }
    }

    async searchPosts(term) {
        if (!term) return [];
        try {
            const res = await this.database.listDocuments(confi.DatabseId,confi.Profiles, [
                Query.search("content", term),
                Query.orderDesc("$createdAt"),
                Query.limit(20)
            ]);
            return res.documents;
        } catch (error) {
            console.error("SearchService :: searchPosts :: error", error);
            return [];
        }
    }


}

export const searchService=new search()
export default searchService