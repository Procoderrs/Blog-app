import React,{useEffect,useState} from 'react';
import api from '../api/api';
import {useNavigate} from 'react-router-dom';

export default function Reader(){
  const [posts,setPosts]=useState([]);
  const navigate=useNavigate();


  useEffect(()=>{
    const load=async()=>{
      const res=await api.get('/posts/public');
      setPosts(res.data);
    }
    load()
  },[]);

  return(
    <>
      <div className='p-6'>
      <h1 className='text-3xl font-bold mb-4'>Latest Blog</h1>
      <button onClick={()=>navigate('/login?reddirect=add-post')}
      className='bg-purple-600 text-white px-4 py-2 mb-6'>
      Add Post
      </button>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
      {posts.map((post)=>(
        <div key={post._id} className='bg-white rounded shadow p-4'>
        <img src={post.image} className='h-[50%] object-cover rounded' alt="" />
        <h2 className='text-xl font-bold mt-3'>{post.title}</h2>

        <p className='text-gray-700 line-clamp-2'>{post.short_desc}</p>

        <button onClick={()=>navigate(`/reader/post/${post._id}`)}
        
        className='text-blue-600 mt-2'>
       Read more →
        </button>
         </div>))}

      </div>

      </div>
    </>
  )
}