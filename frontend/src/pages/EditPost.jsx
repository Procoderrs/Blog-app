
import React from 'react'
import { useState,useContext ,useEffect} from 'react'
import {useParams,useNavigate} from 'react-router-dom'
import api from '../api/api'
import {AuthContext} from '../context/AuthContext'
import Editor from '../components/Editor'

const EditPost = () => {
  console.log('editpost render');
  const {slug}=useParams();
  const navigate=useNavigate();
  const {user}=useContext(AuthContext)



  const [title,setTitle]=useState('');
  const [shot_desc,setShort_desc]=useState('');
  const [content,setContent]=useState('');
  const [image,setImage]=useState(null);
  const [preview,setPreview]=useState();


  //fetch post details
  useEffect(()=>{
    const fetchPost=async()=>{
      const res=await api.get(`/posts/slug/${slug}`,{
        headers:{Authorization:`Bearer ${user.token}`},
      });
      setTitle(res.data.title);
      setShort_desc(res.data.setShort_desc);
      setContent(res.data.content);
      setPreview('http://localhost:5000'+res.data.image);
    };
    fetchPost();
  },[id]);
  const handleImage=(e)=>{
    const file=e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));

  }
  //submit update
  const handleUpdate=async(e)=>{
    e.preventDefault();

    const fd=new FormData();
    fd.append('title',title);
    fd.append('short_desc',shot_desc);
    fd.append('content',content);
    if(image) fd.append('image',image);

    await api.put(`posts/update/slug/${slug}`,fd,{
      headers:{
        Authorization:`Bearer ${user.token}`,
        'Content-Type':'multiprt/form-data',
      },
    });
    alert('post updated');
    navigate('/dashboard');
  }
  return (
    <>
      <div className='max-w-3xl mx-auto mt-10 bg-purple-50 p-8 rounded shadow'>
<h1 className='text-2xl font-bold mb-4'>Edit Post</h1>
<form  onSubmit={handleUpdate} className='space-y-5'>

  <input type="text"  className='border p-2 w-full'
   value={title} onChange={(e)=>setTitle(e.target.value)}/>

   <input type="text" className='border p-2 w-full' 
   value={shot_desc} onChange={(e)=>setShort_desc(e.target.value)} />

   <div>
   <label>Change image:</label>
   <input type="file" onChange={handleImage} />
   {preview && <img src={preview} className='w-40 mt-2 rounded border'/>}
  </div>

  <Editor content={content} onChange={setContent}/>
  <button className='bg-blue-600 text-white p-3 rounded w-full'>Update post</button>

</form>
      </div>
    </>
  )
}

export default EditPost