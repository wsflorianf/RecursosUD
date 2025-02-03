import { Button } from '@material-tailwind/react'
import { Input } from '@material-tailwind/react'
import { useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import { getUserRequest } from '../../api/users'
import useLoaderStore from '../../store/appStore'

export default function Menu() {
  const [searchId, setSearchId] = useState('')
  const [searchResult, setSearchResult] = useState(null)

  const user = useAuthStore((state) => state.user)
  const setLoading = useLoaderStore((state) => state.setLoading)

  const search = async ()=>{
    setLoading(true)
    try {
      const response = await getUserRequest(searchId)
      setSearchResult(response.data)

    }catch(error){
      setSearchResult("No disponible.")
    }
    setLoading(false)
  }

  return (
    
      <div className='p-8 flex flex-col gap-4 w-[80%]'>
        <div className='text-4xl'>
          <p>ID: {user.id}</p>
          <p>Nombre: {user.nombre}</p>
          <p>Correo: {user.correo}</p>
          <p>{user.admin ? 'Es administrador' : 'Es empleado'}</p>
        </div>

        <Input
          label='Ingresar ID'
          onChange={(e) => setSearchId(e.target.value)}
          value={searchId}
        ></Input>

        <Button variant='gradient' onClick={search}>
          Buscar
        </Button>

        <p className='w-full text-wrap break-words'>
          {JSON.stringify(searchResult)}
        </p>
      </div>
    
  )
}
