import {Client,Databases,ID,Query} from "appwrite"
import { confi } from "../confi/confi";
class ChatRoom{
    client;
    database;
    constructor()
    {
        this.client=new Client()
        .setEndpoint(confi.AppWrite)
        .setProject(confi.ProjectId)
        this.database=new Databases(this.client)
    }
    async getUserRooms(userId)
    {
        try {
            return await this.database.listDocuments(confi.DatabseId, confi.ChatRoom, [
            Query.contains("participants", userId),
            // Query.orderDesc("createdAt")
        ]);
        } catch (error) {
            console.log("AppWrite error",error)
            throw error
            
        }
    }

    async updateRoomMetadata(senderId, receiverId, lastMessage) {
        const roomId = [senderId, receiverId].sort().join('_');
        
        const existing = await this.database.listDocuments(confi.DatabseId, confi.ChatRoom, [
            Query.equal("chatRoomId", roomId)
        ]);

        const data = {
            chatRoomId: roomId,
            participants: [senderId, receiverId],
            lastMessage: lastMessage,
            updatedAt: new Date().toISOString()
        };

        if (existing.total > 0) {
            return await this.database.updateDocument(confi.DatabseId, confi.ChatRoom, existing.documents[0].$id, data);
        } else {
            return await this.database.createDocument(confi.DatabseId, confi.ChatRoom, ID.unique(), data);
        }
    }

}

export const ChatRoomsService=new ChatRoom()
export default ChatRoomsService