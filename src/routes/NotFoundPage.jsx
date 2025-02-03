import { Button } from '@material-tailwind/react'
import React from 'react'
import { useNavigate } from 'react-router'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className='min-h-screen bg-gradient-to-br from-black to-gray-400 flex flex-col items-center justify-center text-white'>
      <div className='text-center'>
        <h1 className='text-9xl font-bold mb-4 animate-bounce'>404</h1>

        <h2 className='text-3xl font-semibold mb-6'>
          ¡Ups! Página no encontrada
        </h2>

        <p className='text-lg mb-8'>
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>

        <Button onClick={() => navigate('/')} variant='gradient'>
          Volver al inicio
        </Button>
      </div>
    </div>
  )
}
