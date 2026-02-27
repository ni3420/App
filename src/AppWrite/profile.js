import { Client, Databases,Query ,ID, Storage} from "appwrite"
import { confi } from "../confi/confi";
class profile{
    client;
    database;
 storage;
    
    constructor()
    {
        this.client=new Client()
        .setEndpoint(confi.AppWrite)
        .setProject(confi.ProjectId)
        this.database=new Databases(this.client)
        this.storage=new Storage(this.client)
    }

    


    async createProfile({$id,fullname})
    {
        try {
            const pro= await this.database.createDocument({
                databaseId:confi.DatabseId,
                collectionId:confi.Profiles,
                documentId:$id,
                data:{
                    fullName:fullname
                }
            })
            if(pro)
            {
                return pro
            }
        } catch (error) {
            console.log("Appwrite Error",error)
            throw error
            
        }
    }

    async getProfile(Id) {
        try {
            return await this.database.getDocument(confi.DatabseId, confi.Profiles, Id);
        } catch (error) {
            console.error("ProfileService :: getProfile :: error", error);
            return null;
        }
    }

    async getPostsByUserId(userId) {
    try {
        // We use listDocuments with a filter query
        const posts = await this.database.listDocuments(
            confi.DatabseId,
            confi.CollectionId,
            [
                Query.equal("userId", userId), // Filter by the specific user
                Query.orderDesc("$createdAt"), // Show most recent posts first
                Query.limit(100)               // Adjust limit as needed
            ]
        );

        return posts; // Returns { documents: [], total: number }
    } catch (error) {
        console.error("AppWrite Service :: getPostsByUserId :: error", error);
        return { documents: [], total: 0 };
    }
}

    async ListProfile()
    {
        try {
            const pro= await this.database.listDocuments(
                confi.DatabseId,
                confi.Profiles
            )
            if(pro)
            {
                return pro
                
            }
        } catch (error) {
            console.log(error)
            
        }
    }

    async updateProfile(userId, { username, fullName, bio, about, location, avatarId }) {
    try {
        // Build the payload with only existing attributes
        const payload = {
            username,
            fullName,
            bio,
            about,
            location,
            avatarId
        };

        return await this.database.updateDocument(
            confi.DatabseId, 
            confi.Profiles, 
            userId, 
            payload
        );
    } catch (error) {
        console.error("ProfileService :: updateProfile :: error", error);
        throw error;
    }
}

    async uploadAvatar(file) {
        try {
            const response = await this.storage.createFile(this.bucketId, ID.unique(), file);
            return response.$id;
        } catch (error) {
            console.error("ProfileService :: uploadAvatar :: error", error);
            return null;
        }
    }

    getAvatarPreview(fileId) {
        return this.storage.getFilePreview(this.bucketId, fileId).href;
    }

    async searchProfiles(searchTerm) {
        try {
            return await this.database.listDocuments(confi.DatabseId, confi.Profiles, [
                Query.search("fullName", searchTerm)
            ]);
        } catch (error) {
            console.error("ProfileService :: searchProfiles :: error", error);
            return { documents: [] };
        }
    }



}

export const profileservice=new profile()
export default profileservice



