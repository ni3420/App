export const confi={
    AppWrite:String(import.meta.env.VITE_APPWRITE_URL),
    ProjectId:String(import.meta.env.VITE_PROJECT_ID),
    DatabseId:String(import.meta.env.VITE_DATABASE_ID),
    CollectionId:String(import.meta.env.VITE_COLLECTION_ID),
    BucketId:String(import.meta.env.VITE_BUCKET_ID),
    TinymiceApi:String(import.meta.env.VITE_TINYMICE_API),
    ChatRoom:String(import.meta.env.VITE_CHAT_ROOMS_COLLECTION_ID),
    Comments:String(import.meta.env.VITE_COMMENTS_COLLECTION_ID),
    Profiles:String(import.meta.env.VITE_PROFILE_ID),
    UsersList:String(import.meta.env.VITE_USERS_COLLECTIONS_ID),
    Follows:String(import.meta.env.VITE_FOLLOWS_COLLECTION_ID),
    Messages:String(import.meta.env.VITE_MESSAGE_COLLECTION_ID),
    Likes:String(import.meta.env.VITE_LIKES_COLLCTION_ID)
}