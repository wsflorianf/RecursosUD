import { useAuthStore } from '../store/authStore'
import { Outlet } from 'react-router'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useEffect } from 'react'

export default function Home() {
  const setUser = useAuthStore((state) => state.setUser)

  useEffect(() => {
    if (document.cookie === '') {
      alert('La sesión expiró')
      setUser(null)
    }

    const interval = setInterval(() => {
      if (document.cookie === '') {
        alert('La sesión expiró')
        setUser(null)
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <Header />
      <div className='w-full min-h-[85vh] bg-gray-300 flex flex-col items-center p-8'>
        <Outlet />
      </div>
      <Footer />
    </>
  )
}
