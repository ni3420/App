import {Client,Databases,ID} from "appwrite"
import { confi } from "../confi/confi";
 class Chat{
    client;
    database;
    constructor()
    {
        this.client=new Client()
        .setEndpoint(confi.AppWrite)
        .setProject(confi.ProjectId)
        this.database=new Databases(this.client)
    }

    async sendMessage(senderId, receiverId, content) {
    try {
      const chatRoomId = [senderId, receiverId].sort().join('_');

      const data = {
        senderId,
        receiverId,
        content,
        chatRoomId,
        timestamp: new Date().toISOString(),
      };

      return await this.database.createDocument(
        confi.DatabseId, 
        confi.Messages, 
        ID.unique(), 
        data
      );
    } catch (error) {
      console.error("ChatService :: sendMessage :: error", error);
      throw error;
    }
  }

    async getMessages()
    {
        try {
            const mes=await this.database.listDocuments({
                databaseId:confi.DatabseId,
                collectionId:confi.Messages,
            })
            if(mes)
            {
                return mes
            }
        } catch (error) {
            console.log("Appwrite",error)
            throw error
            
        }
    }



    
    subscribeToMessages(callback) {
    return this.client.subscribe(
        `databases.${confi.DatabseId}.collections.${confi.Messages}.documents`,
        (response) => {
            // Log response to see the exact structure if it fails again
            // console.log("Realtime response:", response);

            // 1. Check if response.events exists and is an array
            if (response.events && Array.isArray(response.events)) {
                
                // 2. Use a more robust check for the 'create' event
                // const isCreateEvent = response.events.some(event => 
                //     event.includes("documents.*.create") || 
                //     event.endsWith(".create")
                // );

        
                    console.log("New message created:", response);
                    callback(response);
                
            }
        }
    );
}
  
}


export const chatservice=new Chat()
export default chatservice