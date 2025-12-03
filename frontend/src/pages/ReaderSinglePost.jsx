import React,{useEffect,useState} from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api';
import PublicHeader from '../components/PublicHeader';


export default function ReaderSinglePost(){

  const {id}=useParams();
  const[post,setPosts] =useState(null);

  useEffect(()=>{
    const load=async()=>{
      const res=await api.get(`/posts/public/${id}`);
      setPosts(res.data)
    }
    load();
  },[])
  if(!post) return <p>loading...</p>


  return(
    <>
    <PublicHeader/>
      <div className='p-6 max-w-4xl mx-auto bg-purple-50'>
      <div className="text-gray-600 text-sm mb-4">
  Written by <span className="font-semibold">{post.author.name}</span>
</div>
<img src={post.image} alt="" className='h-80 object-cover w-full rounded' />
<h1 className='text-3xl font-bold mt-4'>{post.title}</h1>

<p className='text-gray-600 mt-2'>{post.short_desc}</p>

<div dangerouslySetInnerHTML={{__html: post.content}} className='mt-6'>

</div>
      </div>
    </>
  )
}