import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/api'
import { useEffect } from 'react'

const RelatedPosts = ({curentSlug}) => {
  const [loading,setLoading]=useState(true)
  const [posts,setPosts]=useState([])
 const navigate=useNavigate()


  useEffect(()=>{
const loadRelated=async()=>{
  try {
    const res=await api.get('/posts/public?limit=5');
    const filtered=res.data.posts.filter(
    (p)=>p.slug!==curentSlug
    );
    setPosts(filtered);
  } catch (error) {
    console.log('related post errror',error);
  }
  finally{
    setLoading(false)
  }
}
loadRelated();
  },[curentSlug])

  return (
    <>
    <aside className='sticky top-24 bg-[#F9F8F6] rounded-xl shadow-sm p-4'>
       <h3  className='text-lg font-semibold mb-4 border-b pb-2'> More Blogs</h3>

       {loading ?(
        <p className='text-sm text-gray-900 '>
          Loading...
        </p>
       ):(<div className='flex flex-col gap-4'>
{posts.map((post)=>(
  <div key={post._id} onClick={()=>navigate(`/reader/post/${post.slug}`)} className='flex gap-3 cursor-pointer group'>
     <img src={post.image} alt={post.title} className='w-16 h-16 object-cover rounded-md' />
     <div className='flex flex-col'>
          <p className='text-sm font-semibold leading-snug group-hover:text-purple-600 transition'>
            {post.title}
          </p>
          <span className='text-xs text-gray-500'> {new Date(post.createdAt).toLocaleDateString()}</span>
     </div>
    </div>
))}
        </div>)}
    </aside>
    </>
  )
}

export default RelatedPosts