import { Button, Card, Typography, Input } from '@material-tailwind/react'
import InputPassword from '../components/InputPassword'
import { useForm } from 'react-hook-form'
import InputMessage from '../components/InputMessage'
import { loginRequest, logoutRequest } from '../api/auth'
import { useAuthStore } from '../store/authStore'
import { Navigate, useNavigate } from 'react-router'
import useAppStore from '../store/appStore'

function Login() {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const { user, setUser } = useAuthStore((state) => state)
  const {setBarOptions,setLoading} = useAppStore(state=>state)
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    setLoading(true)

    let response

    try {
      response = await loginRequest(data.email, data.password)

      if (response.status === 200) {
        console.log(response.data)
        setUser(response.data)
        navigate('/')
      }
    } catch (error) {
      if(error.code==="ERR_NETWORK") setBarOptions({message: "Error de Conexión", color: 'red'})
      else setBarOptions({message: error.response.data.mensaje, color: 'red'})
    }finally{
      setLoading(false)
    }
  }

  if (user) return <Navigate to='/' />

  return (
    <>
      <div> 
        <Card className='p-8 w-fit m-16 shadow-sm shadow-white'>
          <Typography className='text-center' variant='h3' color='black'>
            Iniciar Sesión
          </Typography>
          <form
            className='mt-4 mb-2 w-80 max-w-screen-lg sm:w-96'
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className='mb-1 flex flex-col gap-6'>
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
                })}
              />
              {errors.password && (
                <InputMessage message={errors.password.message} error/>
              )}
            </div>

            <Button variant='gradient' className='mt-6' fullWidth type='submit'>
              Ingresar
            </Button>
            <Typography color='gray' className='mt-4 text-center font-normal'>
              ¿No está registrado?{' '}
              <a href='/register' className='font-medium text-gray-900'>
                ¡Registrarme!
              </a>
            </Typography>
          </form>
        </Card>
      </div>
    </>
  )
}

export default Login
