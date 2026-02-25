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

    async getProfile(userId) {
        try {
            return await this.database.getDocument(confi.DatabseId, confi.Profiles, userId);
        } catch (error) {
            console.error("ProfileService :: getProfile :: error", error);
            return null;
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

    async updateProfile(userId, data) {
        try {
            return await this.database.updateDocument(confi.DatabseId, confi.Profiles, userId, data);
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



