import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Image as ImageIcon, X, Loader2, Globe } from 'lucide-react'
import Buttons from '../Components/Buttons'
import { postservice } from '../AppWrite/post'
import toast from 'react-hot-toast'

const CreatePost = () => {
  const { register, handleSubmit, watch, reset, setValue } = useForm()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(null)
  
  const userData = useSelector((state) => state.auth.userData)
  const isDark = useSelector((state) => state.theme.mode === 'dark')

  const watchedTitle = watch("title")
  const watchedImage = watch("image")

  // Handle Image Preview
  useEffect(() => {
    if (watchedImage && watchedImage[0]) {
      const url = URL.createObjectURL(watchedImage[0])
      setPreview(url)
      return () => URL.revokeObjectURL(url)
    }
  }, [watchedImage])

  const isFormEmpty = !watchedTitle?.trim() && !preview

  const onSubmit = async (data) => {
    if (isFormEmpty) return
    setLoading(true)

    const postPromise = (async () => {
      let fileId = null
      
      // 1. Upload file if selected
      if (data.image && data.image[0]) {
        const fileUpload = await postservice.uploadfile(data.image[0])
        if (fileUpload) fileId = fileUpload.$id
      }

      // 2. Create the post
      const dbPost = await postservice.CreatePost({
        title: data.title || "",
        image: fileId,
        userId: userData.$id,
        username: userData.name,
        status: "active"
      })

      if (!dbPost) throw new Error("Database error")
      return dbPost
    })()

    toast.promise(postPromise, {
      loading: 'Sharing your post...',
      success: () => {
        navigate('/all_post')
        return 'Post shared successfully! 🚀'
      },
      error: 'Failed to share post. Please try again.',
    }, {
      style: {
        borderRadius: '10px',
        background: isDark ? '#1e293b' : '#fff',
        color: isDark ? '#fff' : '#333',
      },
    })

    try {
      await postPromise
    } catch (e) {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    reset()
    navigate(-1)
  }

  return (
    <div className={`min-h-screen p-4 md:p-10 flex justify-center items-start transition-colors duration-500 ${
      isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-gray-800'
    }`}>
      
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 blur-[100px] pointer-events-none"></div>

      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className={`max-w-xl w-full p-8 rounded-4xl border shadow-2xl backdrop-blur-md transition-all ${
          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-white shadow-slate-200'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20 overflow-hidden">
               <img src={userData?.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt="user" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="font-black text-lg tracking-tight">{userData?.name || "User"}</h2>
              <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold text-blue-500">
                <Globe size={12} />
                <span>Public Post</span>
              </div>
            </div>
          </div>
          
          <button 
            type="button" 
            onClick={handleCancel}
            className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-100'}`}
          >
            <X size={24} className="opacity-50" />
          </button>
        </div>

        <div className="space-y-6">
          <textarea 
            {...register("title")}
            placeholder="What's on your mind?"
            className={`w-full text-xl p-0 bg-transparent outline-none resize-none min-h-30 font-medium ${
              isDark ? 'placeholder-slate-600' : 'placeholder-gray-400'
            }`}
          />

          {preview && (
            <div className="relative group rounded-3xl overflow-hidden border-2 border-blue-500/10">
              <button 
                type="button"
                onClick={() => {
                   setValue("image", null)
                   setPreview(null)
                }}
                className="absolute top-4 right-4 p-2 bg-black/60 text-white rounded-full hover:bg-red-500 transition-all z-10 scale-0 group-hover:scale-100"
              >
                <X size={18} />
              </button>
              <img src={preview} alt="Preview" className="w-full h-auto max-h-87.5 object-cover" />
            </div>
          )}

          <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-slate-800/50">
            <div className="flex gap-2">
               <label className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-xl transition-all font-bold text-sm ${
                 isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-blue-50 text-slate-600'
               }`}>
                 <ImageIcon size={20} className="text-blue-500" />
                 <span>Photo</span>
                 <input 
                   type="file" 
                   accept="image/*"
                   className="hidden"
                   {...register("image")}
                 />
               </label>
            </div>

            <div className="flex gap-3">
                <Buttons 
                  type="submit" 
                  className={`rounded-xl px-8 py-3 text-sm font-black transition-all active:scale-95 flex items-center gap-2 ${
                    isFormEmpty 
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed grayscale' 
                    : 'bg-blue-600 text-white shadow-xl shadow-blue-500/20 hover:bg-blue-700'
                  }`}
                  disabled={loading || isFormEmpty}
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    "Share Post"
                  )}
                </Buttons>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default CreatePost