import { useState } from 'react'
import { Button, Card, Typography, Input } from '@material-tailwind/react'
import InputPassword from '../components/InputPassword'
import { Switch } from '@material-tailwind/react'
import { useForm } from 'react-hook-form'
import InputMessage from '../components/InputMessage'
import { registerUserRequest } from '../api/users'
import { Navigate } from 'react-router'
import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router'
import useAppStore from '../store/appStore'

function Register() {
  const { setbarOptions, setLoading } = useAppStore((state) => state)
  const { user, setUser } = useAuthStore((state) => state)
  const navigate = useNavigate()
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const response = await registerUserRequest(data)

      if (response.status === 201) {
        setUser(response.data)
        navigate('/')
      }
    } catch (error) {
      if(error.code==="ERR_NETWORK") setBarOptions({message: "Error de Conexión", color: 'red'})
      else setbarOptions({message: error.response.data.message, color: 'red'})
    } finally {
      setLoading(false)
    }
  }

  if (user) return <Navigate to='/' />

  return (
    <div>
      <Card className='p-8 w-fit mt-14 shadow-sm shadow-white'>
        <Typography className='text-center' variant='h3' color='black'>
          Registro de Usuario
        </Typography>
        <form
          className='mt-4 mb-2 w-80 max-w-screen-lg sm:w-96'
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className='mb-1 flex flex-col gap-6'>
            <Input
              size='lg'
              placeholder='Fulanito'
              label='Nombre'
              variant='standard'
              error={errors.name ? true : false}
              {...register('name', {
                required: {
                  value: true,
                  message: 'Este campo es obligatorio.',
                },
                minLength: {
                  value: 4,
                  message: 'El nombre debe contener mínimo 4 caracteres.',
                },
              })}
            />
            {errors.name && <InputMessage message={errors.name.message} error/>}
            <Input
              size='lg'
              placeholder='name@mail.com'
              type='email'
              label='Correo Electrónico'
              variant='standard'
              error={errors.email ? true : false}
              {...register('email', {
                required: {
                  value: true,
                  message: 'Este campo es obligatorio.',
                },
                pattern: {
                  value:
                    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/i,
                  message: 'El correo no es válido.',
                },
              })}
            />
            {errors.email && <InputMessage message={errors.email.message} error/>}
            <InputPassword
              size='lg'
              label='Contraseña'
              variant='standard'
              autoComplete='on'
              error={errors.password ? true : false}
              {...register('password', {
                required: {
                  value: true,
                  message: 'Este campo es obligatorio.',
                },
                minLength: {
                  value: 8,
                  message: 'La contraseña debe contener mínimo 8 caracteres.',
                },
              })}
            />
            {errors.password && (
              <InputMessage message={errors.password.message} error/>
            )}
            <Input
              size='lg'
              label='Repetir Contraseña'
              variant='standard'
              type='password'
              autoComplete='on'
              error={errors.passwordV ? true : false}
              {...register('passwordV', {
                required: {
                  value: true,
                  message: 'Este campo es obligatorio.',
                },
                validate: (value) =>
                  value === watch('password') ||
                  'Las contraseñas no coinciden.',
              })}
            />
            {errors.passwordV && (
              <InputMessage message={errors.passwordV.message} error/>
            )}
          </div>
          <br />
          <Switch label='Administrador' {...register('admin')} />
          <Button variant='gradient' className='mt-6' fullWidth type='submit'>
            Crear Usuario
          </Button>
          <Typography color='gray' className='mt-4 text-center font-normal'>
            ¿Ya tienes una cuenta?{' '}
            <a href='/login' className='font-medium text-gray-900'>
              Iniciar Sesión
            </a>
          </Typography>
        </form>
      </Card>
    </div>
  )
}

export default Register
