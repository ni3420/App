import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Image as ImageIcon, X, ArrowLeft } from 'lucide-react'
import Buttons from '../Components/Buttons'
import postservice from '../AppWrite/post'

const UpdatePost = () => {
    const { id } = useParams() // Get post ID from URL
    const navigate = useNavigate()
    const { register, handleSubmit, watch, reset, setValue } = useForm()
    
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [preview, setPreview] = useState(null)
    const [oldImageId, setOldImageId] = useState(null)

    const isDark = useSelector((state) => state.theme.mode === 'dark')
    const watchedImage = watch("image")

    // 1. Fetch existing data and pre-fill form
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const post = await postservice.ReadPost(id)
                if (post) {
                    // Pre-fill the text fields
                    reset({
                        title: post.title,
                    })
                    // Store existing image info
                    setOldImageId(post.image)
                    if (post.image) {
                        setPreview(postservice.ImagePost(post.image))
                    }
                }
            } catch (error) {
                console.error("Fetch error:", error)
                navigate('/all_post')
            } finally {
                setFetching(false)
            }
        }
        fetchPost()
    }, [id, reset, navigate])

    // 2. Handle Image Preview for new selection
    useEffect(() => {
        if (watchedImage && watchedImage[0] instanceof File) {
            const url = URL.createObjectURL(watchedImage[0])
            setPreview(url)
            return () => URL.revokeObjectURL(url)
        }
    }, [watchedImage])

    const onSubmit = async (data) => {
        setLoading(true)
        try {
            let fileId = oldImageId

            // 3. Only upload if a NEW file is selected
            if (data.image && data.image[0] instanceof File) {
                const fileUpload = await postservice.uploadfile(data.image[0])
                if (fileUpload) {
                    // Delete the old image from storage if it exists
                    if (oldImageId) await postservice.deleteFile(oldImageId)
                    fileId = fileUpload.$id
                }
            }

            const dbPost = await postservice.UpdatePost(id, {
                title: data.title,
                image: fileId,
            })

            if (dbPost) {
                navigate('/all_post')
            }
        } catch (error) {
            console.error("Update failed:", error)
        } finally {
            setLoading(false)
        }
    }

    if (fetching) return <div className="text-center p-10">Loading Post...</div>

    return (
        <div className={`min-h-screen p-4 md:p-6 flex justify-center ${isDark ? 'bg-slate-950 text-white' : 'bg-gray-50 text-gray-800'}`}>
            <form 
                onSubmit={handleSubmit(onSubmit)} 
                className={`max-w-xl w-full p-6 rounded-xl border shadow-sm h-fit ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}
            >
                <div className="flex items-center gap-4 mb-6">
                    <button type="button" onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full">
                        <ArrowLeft size={20} />
                    </button>
                    <h2 className="font-bold text-xl">Edit Post</h2>
                </div>

                <div className="space-y-4">
                    

                    <textarea 
                        {...register("title")}
                        placeholder="What's on your mind?"
                        className={`w-full p-2 bg-transparent outline-none resize-none min-h-[150px] ${isDark ? 'placeholder-slate-500' : 'placeholder-gray-400'}`}
                    />

                    {preview && (
                        <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700">
                            <button 
                                type="button"
                                onClick={() => {
                                    setValue("image", null)
                                    setPreview(null)
                                    setOldImageId(null) // User wants to remove image
                                }}
                                className="absolute top-2 right-2 p-1 bg-black/60 text-white rounded-full hover:bg-black/80 z-10"
                            >
                                <X size={20} />
                            </button>
                            <img src={preview} alt="Preview" className="w-full h-auto max-h-[300px] object-contain bg-black/5" />
                        </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-800">
                        <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-gray-500">
                            <ImageIcon size={24} className="text-blue-500" />
                            <span className="text-sm font-semibold">Change Photo</span>
                            <input 
                                type="file" 
                                accept="image/*"
                                className="hidden"
                                {...register("image")}
                            />
                        </label>

                        <div className="flex gap-2">
                            <Buttons 
                                type="button" 
                                onClick={() => navigate(-1)}
                                className="bg-transparent !text-gray-500 border border-gray-300 rounded-full px-6"
                            >
                                Cancel
                            </Buttons>
                            <Buttons 
                                type="submit" 
                                className="rounded-full px-6"
                                disabled={loading}
                            >
                                {loading ? "Updating..." : "Save Changes"}
                            </Buttons>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default UpdatePost