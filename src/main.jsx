import './index.css'
import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router'
import { ThemeProvider } from '@material-tailwind/react'
import { ThemeProvider as ThemProviderM, createTheme } from '@mui/material'
import App from './App.jsx'
import Login from './routes/Login.jsx'
import Register from './routes/Register.jsx'
import Home from './routes/Home.jsx'
import { ProtectedRoute } from './routes/ProtectedRoute.jsx'
import { useAuthStore } from './store/authStore.js'
import Menu from './routes/Home/Menu.jsx'
import ServiceUnits from './routes/Home/ServiceUnits.jsx'
import { esES } from '@mui/x-data-grid/locales'
import ResourceTypes from './routes/Home/RecourseTypes.jsx'
import NotFoundPage from './routes/NotFoundPage.jsx'
import Resources from './routes/Home/Resources'
import Reservations from './routes/Home/Reservations'
import Loans from './routes/Home/Loans'
import Devolutions from './routes/Home/Devolutions'
import Ratings from './routes/Home/Ratings'

const isLogged = useAuthStore.getState().user !== null

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: (
          <ProtectedRoute isAllowed={isLogged}>
            <Home />
          </ProtectedRoute>
        ),
        children: [
          {
            path: '/',
            element: <Menu />,
          },
          { path: '/units', element: <ServiceUnits /> },
          { path: '/types', element: <ResourceTypes/> },
          { path: '/resources', element: <Resources/> },
          { path: '/reservations', element: <Reservations/> },
          { path: '/loans', element: <Loans/> },
          { path: '/devolutions', element: <Devolutions/> },
          { path: '/ratings', element: <Ratings/> },
        ],
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemProviderM theme={createTheme(esES)}>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </ThemProviderM>
  </StrictMode>
)
