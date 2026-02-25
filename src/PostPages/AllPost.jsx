import {useSelector} from "react-redux"
import {useState,useEffect} from "react"
import {postservice} from "../AppWrite/post"
import PostCard  from "./PostCard";
const AllPost = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const isDark = useSelector((state) => state.theme.mode === 'dark');

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await postservice.ListPost();
                if (res) setPosts(res.documents);
            } catch (error) {
                console.error("AllPOST PAGE ERROR", error);
            } finally {
                setLoading(false);
            }
        };
        getData();
    }, []);

    if (loading) return (
        <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className={`min-h-screen py-8 px-4 ${isDark ? 'bg-slate-950' : 'bg-gray-50'}`}>
            <div className="max-w-2xl mx-auto">
                <header className="mb-8">
                    <h1 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Recent Updates
                    </h1>
                </header>

                {posts.length > 0 ? (
                    posts.map((post) => <PostCard key={post.$id} post={post} />)
                ) : (
                    <div className="text-center py-10 text-gray-500">
                        No posts found. Start following people to see updates!
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllPost