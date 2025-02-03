import LogOutIcon from '../assets/icons/LogOutIcon'
import { Button } from '@material-tailwind/react'
import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router'
import { logoutRequest } from '../api/auth'
import { Tooltip } from '@material-tailwind/react'

function Header() {
  const { user, setUser, changeAdmin } = useAuthStore((state) => state)
  const navigate = useNavigate()

  const logOut = async () => {
    const response = await logoutRequest()

    if (response.status === 200) {
      setUser(null)
      navigate('/login')
    }
  }

  return (
    <div className='w-full h-[15vh] bg-white px-8 flex items-center box-border justify-between'>
      <h1 className='text-5xl font-bold'>Recursos UD</h1>
      <div className='flex gap-2 items-center'>
        {user.admin && (
          <>
            <Button onClick={() => navigate('/units')}>
              Unidades Servicio
            </Button>
            <Button onClick={() => navigate('/types')}>Tipos de Recurso</Button>
          </>
        )}
        <Button onClick={() => navigate('/resources')}>Recursos</Button>
        <Button onClick={() => navigate('/reservations')}>Reservas</Button>
        <Button onClick={() => navigate('/loans')}>Prestamos</Button>
        <Button onClick={() => navigate('/devolutions')}>Devoluciones</Button>
        <Button onClick={() => navigate('/ratings')}>Calificaciones</Button>

        <Button onClick={changeAdmin}>C</Button>

        <Tooltip content='Cerrar sesión' placement='bottom'>
          <Button
            onClick={logOut}
            className='h-20 w-20 rounded-full'
            variant='text'
          >
            <LogOutIcon />
          </Button>
        </Tooltip>
      </div>
    </div>
  )
}

export default Header
