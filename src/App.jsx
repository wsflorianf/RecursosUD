import {Outlet} from 'react-router'
import './App.css'
import Loader from './components/Loader'
import useAppStore from './store/appStore'
import ErrorBar from './components/BarMessage'

function App() {
  
  const loading = useAppStore(state=>state.loading)

  return (
    <div id='main-container' className='min-h-screencreen w-auto flex flex-col items-center'>
      <Outlet/>
      {loading && <Loader/>}
      <ErrorBar/>
    </div>
  )
}

export default App
