import { Button, IconButton, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import cls from './AddPost.module.scss'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector } from 'react-redux';
import { selectIsAuth } from '../../redux/slices/auth';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from '../../axios';



const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});





const AddPost = () => {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [tags, setTags] = useState([])
  const [newTag, setNewTag] = useState('')
  const [text, setText] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  

  const params = useParams();
 

  useEffect(() => {
    if (params.id) {
      axios.get(`/posts/${params.id}`).then((res) => {
        const data = res.data
        setTitle(data.title);
        setTags(data.tags);
        setImageUrl(data.imageUrl);
        setText(data.text)

      })
    }
  }, [])

//--------------------------image

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append('image', file);
      const { data } = await axios.post('/upload', formData)
      console.log(data);
      setImageUrl(data.url)
    } catch (error) {
      console.warn(error);
    }
  }

  
  function handleDeleteImage() {
    setImageUrl('')



  }
//------------------------------


  const onSubmit = async () => {
    try {
      const articleData = {
        title,
        tags,
        text,
        imageUrl,
      }



      let response;
      if (params.id) {
        console.log(params.id);
        response = await axios.patch(`/posts/${params.id}`, articleData);
        navigate(`/posts/${params.id}`)
      } else {
        response = await axios.post('/posts', articleData);
        const { data } = response;
      
      const postId = data._id
      navigate(`/posts/${postId}`)
      }
      
    } catch (error) {
      console.warn(error);
      alert('error')
    }


  }

  function handleSetText(e) {
    const newValue = e.target.value

    setText(newValue)



  }


  function handleSetNewTag(e) {
    const newValue = e.target.value
    if (!newValue.includes(' ') && (newValue.length < 21)) {
      setNewTag(newValue)
    }


  }


  function handleSetTags() {
    if (newTag && tags.length < 21) {
      setTags(prevTags => [...prevTags, newTag])

      setNewTag('')
    }

  }

  function handleSetTitle(e) {
    setTitle(e.target.value)
  }

  function deleteTag(index) {
    const newArray = tags.filter((e, i) => i !== index)
    setTags(newArray)
  }







  const isAuth = useSelector(selectIsAuth)

  if (!window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to='/' />
  }
  return (
    <div className={cls.addpost}>
      <div className={cls.container}>
        <form className={cls.addpostForm} >

          {imageUrl ? (
            <>
              <Button variant="outlined" onClick={handleDeleteImage} color="error">Delete image</Button>
              <div className={cls.image}>
                <img src={imageUrl} alt="post image" />
              </div>
            </>
          ) : (
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}

            >
              Upload file
              <VisuallyHiddenInput type="file" onChange={handleChangeFile} accept="image/*" />
            </Button>
          )
          }


          <TextField
            id="standard-multiline-flexible"
            label="Title"
            multiline
            maxRows={4}
            size='small'
            variant="standard"
            value={title}
            onChange={handleSetTitle}
            inputProps={{ style: { fontSize: '20px' } }}

          />
          <div className={cls.addTag}>
            <TextField
              id="standard-multiline-flexible"
              label="New tag"
              multiline
              maxRows={4}
              size='small'
              variant="standard"
              value={newTag}
              onChange={handleSetNewTag}
            />
            <Button variant="contained" color="success" onClick={handleSetTags}>
              Add
            </Button>
          </div>
          <div className={cls.addedTags}>

            {tags.map((e, index) => (
              <div key={index}>
                <div>#{e}</div>
                <IconButton aria-label="delete" onClick={() => deleteTag(index)}>
                  <DeleteIcon />
                </IconButton>
              </div>
            ))}
          </div>




          <TextField multiline label="Text" value={text} onChange={handleSetText} />
          <Button variant="outlined" onClick={onSubmit} >Publikate</Button>


        </form>
      </div>
    </div>
  );
}

export default AddPost;