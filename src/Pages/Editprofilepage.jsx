import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { Camera, X, Loader2 } from 'lucide-react'
import Input from '../Components/Input'
import profileservice from '../AppWrite/profile'
import postservice from '../AppWrite/post' 

const Editprofilepage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { register, handleSubmit, reset, watch,  } = useForm()
    
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)
    const [preview, setPreview] = useState(null)
    
    const isDark = useSelector((state) => state.theme.mode === 'dark')
    const watchedAvatar = watch("avatarFile")

    // Handle Preview for new avatar selection
    useEffect(() => {
        if (watchedAvatar && watchedAvatar[0]) {
            const url = URL.createObjectURL(watchedAvatar[0])
            setPreview(url)
            return () => URL.revokeObjectURL(url)
        }
    }, [watchedAvatar])

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await profileservice.ListProfile()
                if (response) {
                    const userData = response.documents.find((doc) => doc.$id === id)
                    if (userData) {
                        reset({
                            username: userData.username,
                            fullName: userData.fullName,
                            bio: userData.bio,
                            about: userData.about,
                            location: userData.location,
                        })
                        setPreview(userData.avatar)
                    }
                }
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        fetchProfile()
    }, [id, reset])

    const updateProfile = async (data) => {
        setUpdating(true)
        try {
            let avatarUrl = preview // keep current if no new file

            // 1. Upload new avatar if selected
            if (data.avatarFile && data.avatarFile[0]) {
                const fileUpload = await postservice.uploadfile(data.avatarFile[0])
                if (fileUpload) {
                    // Assuming ImagePost returns the preview URL of the file
                    avatarUrl = fileUpload.$id
                }
            }

            // 2. Update profile document
            const {  ...profileData } = data // remove file object from doc data
            const updated = await profileservice.updateProfile(id, {
                ...profileData,
                avatarId: avatarUrl
            })

            if (updated) {
                navigate(`/my_profile/${data.fullName}/${id}`)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setUpdating(false)
        }
    }

    if (loading) return (
        <div className={`h-screen w-full flex flex-col items-center justify-center gap-4 ${isDark ? 'bg-slate-950 text-white' : 'bg-gray-50 text-gray-800'}`}>
            <Loader2 className="animate-spin text-blue-500" size={40} />
            <p className="font-medium animate-pulse">Fetching Profile Details...</p>
        </div>
    )

    return (
        <div className={`min-h-screen p-4 md:p-10 transition-colors duration-300 ${isDark ? 'bg-slate-950 text-white' : 'bg-gray-50 text-gray-800'}`}>
            <div className={`max-w-2xl mx-auto p-6 md:p-10 rounded-3xl shadow-2xl border transition-all ${
                isDark ? 'bg-slate-900 border-slate-800 shadow-black/40' : 'bg-white border-gray-100 shadow-gray-200'
            }`}>
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-extrabold tracking-tight">Edit Profile</h1>
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-black/5 rounded-full"><X /></button>
                </div>
                
                <form onSubmit={handleSubmit(updateProfile)} className="space-y-6">
                    {/* Avatar Selection Area */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500/20 p-1">
                                <img 
                                    src={preview || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                                    alt="Avatar Preview" 
                                    className="w-full h-full object-cover rounded-full"
                                />
                            </div>
                            <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-300">
                                <Camera size={28} />
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    className="hidden" 
                                    {...register("avatarFile")}
                                />
                            </label>
                        </div>
                        <p className="text-xs mt-3 text-gray-500 font-medium">Click image to change avatar</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input 
                            label="Display Name" 
                            placeholder="e.g. John Doe"
                            {...register("fullName")} 
                        />
                        <Input 
                            label="Handle" 
                            placeholder="e.g. johndoe_99"
                            {...register("username")} 
                        />
                    </div>

                    <Input 
                        label="Location" 
                        placeholder="City, Country"
                        {...register("location")} 
                    />

                    <div className="space-y-1">
                        <label className="text-sm font-bold ml-1 opacity-70">Short Bio</label>
                        <textarea 
                            {...register("bio")}
                            placeholder="Briefly describe yourself..."
                            className={`w-full p-4 rounded-2xl border outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none ${
                                isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200'
                            }`}
                            rows="2"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-bold ml-1 opacity-70">Detailed About</label>
                        <textarea 
                            {...register("about")}
                            placeholder="Tell the community more about your journey..."
                            className={`w-full p-4 rounded-2xl border outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none ${
                                isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200'
                            }`}
                            rows="4"
                        />
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 pt-6">
                        <button 
                            type="submit"
                            disabled={updating}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            {updating ? <><Loader2 className="animate-spin" size={20} /> Updating...</> : "Save Changes"}
                        </button>
                        <button 
                            type="button"
                            onClick={() => navigate(-1)}
                            className={`px-8 py-4 rounded-2xl font-bold border transition-all active:scale-[0.98] ${
                                isDark ? 'border-slate-700 hover:bg-slate-800' : 'border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Editprofilepage