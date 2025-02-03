import { useState } from 'react'
import { useEffect } from 'react'
import { getUnits } from '../../api/units'
import useAppStore from '../../store/appStore'
import StyledDataGrid from '../../components/styled/StyledDataGrid'
import CalendarIcon from '../../assets/icons/CalendarIcon'
import { Button, DialogHeader } from '@material-tailwind/react'
import { Dialog } from '@material-tailwind/react'
import TimeTable from '../../components/TimeTable'
import { useAuthStore } from '@/store/authStore'
import { Navigate } from 'react-router'

export default function ServiceUnits() {
  const [open, setOpen] = useState(false)
  const [horary, setHorary] = useState()
  const { setLoading, setBarOptions, loading } = useAppStore((state) => state)
  const [unidades, setUnidades] = useState()
  const user = useAuthStore((state) => state.user)

  useEffect(() => {
    const fetchUnidades = async () => {
      try {
        const unidades = await getUnits()
        setUnidades(unidades.data)
      } catch (error) {
        if (error.code === 'ERR_NETWORK')
          setBarOptions({ message: 'Error de Conexión', color: 'red' })
        else
          setBarOptions({ message: error.response.data.message, color: 'red' })

          setUnidades([])
      }
    }

    fetchUnidades()
  }, [])

  const columns = [
    {
      field: 'id',
      type: 'number',
      headerName: 'ID',
      flex: 0.5,
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
    },
    { field: 'nombre', type: 'string', headerName: 'Nombre', flex: 0.7 },
    {
      field: 'tiempoMin',
      type: 'string',
      headerName: 'Tiempo Mínimo',
      flex: 0.7,
    },
    {
      field: 'operaciones',
      type: 'actions',
      headerName: 'Horario',
      flex: 0.3,
      getActions: ({ id, row }) => {
        return [
          <>
            <Button
              onClick={() => {
                setHorary(JSON.parse(row.horarioDisponibilidad))
                setOpen(true)
              }}
              className='p-2'
              variant='text'
            >
              <CalendarIcon />
            </Button>
          </>,
        ]
      },
    },
  ]

  if (!user.admin) return <Navigate to={'/'} />

  return (
    <>
      <div className='h-full w-[800px] max-w-full m-2'>
        <StyledDataGrid
          autoHeight
          columns={columns}
          rows={unidades}
          getRowId={(row) => row.id}
          loading={typeof unidades == 'undefined'}
          getRowHeight={() => 'auto'}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
            sorting: {
              sortModel: [{ field: 'id', sort: 'asc' }],
            },
          }}
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0
              ? 'theme-even'
              : 'theme-odd'
          }
          pageSizeOptions={[5, 10]}
        />
      </div>
      <Dialog size='lg' open={open} handler={() => setOpen((prev) => !prev)}>
        <DialogHeader className='justify-center'>
          Horario de Disponibilidad
        </DialogHeader>
        <div className='px-4 pb-4'>
          <TimeTable horary={horary} />
        </div>
      </Dialog>
    </>
  )
}
