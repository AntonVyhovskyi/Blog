import { Button, TextField } from '@mui/material'
import cls from './UpdateProfile.module.scss'
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Navigate } from 'react-router-dom'
import { fetchUserRegistr, fetchUserUpdate, selectIsAuth } from '../../redux/slices/auth'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import axios from '../../axios.js'




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

const UpdateProfile = () => {
   
    const { data } = useSelector(state => state.auth)
    const isAuth = useSelector(selectIsAuth)
    const [imageUrl, setImageUrl] = useState(data?.avatarUrl || '');
    const [fullname, setFullName] = useState(data?.fullName || '')
    const dispatch = useDispatch()
    const { register, setValue,
        handleSubmit,
        formState: { errors, isValid }
    } = useForm({
        defaultValues: {
            fullName: data?.fullName || '',

        }
    }
    )

    const handleUserName = (e) => {
        setFullName(e.target.value)
    }

    const onSubmit = async (values) => {
        const data = await dispatch(fetchUserUpdate({...values, avatarUrl: imageUrl}))
        console.log({...values, avatarUrl: imageUrl});

        if (!data.payload) {
            return alert('не уделось авторизоватся')
        }

        if ('token' in data.payload) {
            window.localStorage.setItem('token', data.payload.token)
        }
    }

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



    if (!isAuth) {
        return <Navigate to='/' />
    }




    return (
        <div className={cls.container}>
            <div className={cls.box}>
                <form onSubmit={handleSubmit(onSubmit)}>
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
                      onChange={(e) => setValue('fullName', e.target.value)}
                      id="outlined-basic" 
                     label="Full name" variant="outlined"
                      {...register('fullName', { required: 'Enter your full name' })} 
                      helperText={errors.fullName?.message} 
                      error={Boolean(errors.fullName?.message)} />
                    
                    <Button type='submit' disabled={!isValid} variant="outlined">Update</Button>
                </form>


            </div>
        </div>
    );
}

export default UpdateProfile;