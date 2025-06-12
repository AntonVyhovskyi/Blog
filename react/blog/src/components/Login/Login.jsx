import { Button, TextField } from '@mui/material';
import cls from './Login.module.scss'
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserData, selectIsAuth } from '../../redux/slices/auth';
import { Navigate } from 'react-router-dom';



const Login = () => {
    

    const isAuth = useSelector(selectIsAuth)
    
    const dispatch = useDispatch()
    const { register,
        handleSubmit,
        formState: { errors, isValid }
    } = useForm({
        defaultValues: {
            email: '',
            password: '',
        }
    }
    )

    const onSubmit = async (values) => {
        const data = await dispatch(fetchUserData(values))

        if(!data.payload) {
            return alert ('не уделось авторизоватся')
        }
        
        if ('token' in data.payload) {
            window.localStorage.setItem('token', data.payload.token)
        }
    }



    if (isAuth) {
        return <Navigate to='/' />
    }

    return (
        <div className={cls.container}>
            <div className={cls.box}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextField type='email' id="outlined-basic" label="E-mail" variant="outlined" {...register('email', {required: 'Enter your email'})} helperText={errors.email?.message} error={Boolean(errors.email?.message)} />
                    <TextField id="outlined-basic" label="Password" variant="outlined" {...register('password', {required: 'Enter your password'})}  helperText={errors.password?.message} error={Boolean(errors.email?.message)}/>
                    <Button type='submit' disabled={!isValid} variant="outlined">Login</Button>
                </form>


            </div>
        </div>
    );
}

export default Login;