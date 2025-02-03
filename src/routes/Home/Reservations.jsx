import { useState } from 'react'
import { useEffect } from 'react'
import useAppStore from '../../store/appStore'
import StyledDataGrid from '../../components/styled/StyledDataGrid'
import { Button, DialogHeader } from '@material-tailwind/react'
import { Dialog } from '@material-tailwind/react'
import { useAuthStore } from '@/store/authStore'
import { getResources } from '@/api/resources'
import NewReservation from '@/components/forms/NewReservation'
import ClockCheckIcon from '@/assets/icons/ClockCheckIcon'
import { getReservations } from '@/api/reservations'

export default function Reservations() {
  const [open, setOpen] = useState(false)
  const [reservation, setReservation] = useState()
  const { setLoading, setBarOptions, loading } = useAppStore((state) => state)
  const [reservations, setReservations] = useState()
  const user = useAuthStore((state) => state.user)

  useEffect(() => {
    const fetchUnidades = async () => {
      try {
        const reservations = await getReservations()
        reservations.data = reservations.data
        setReservations(reservations.data)
      } catch (error) {
        if (error.code === 'ERR_NETWORK')
          setBarOptions({ message: 'Error de Conexión', color: 'red' })
        else
          setBarOptions({ message: error.response.data.message, color: 'red' })

          setReservations([])
      }
    }

    fetchUnidades()
  }, [])

  const columns = [
    {
      field: 'id',
      type: 'number',
      headerName: 'ID',
      flex: 0.3,
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
    },
    {
      field: 'idRecurso',
      type: 'string',
      headerName: 'Identificador Recurso',
      flex: 0.3,
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
    },
    {
      field: 'nombreRecurso',
      type: 'string',
      headerName: 'Recurso',
      flex: 0.6,
    },
    {
      field: 'nombreUsuario',
      type: 'string',
      headerName: 'Usuario',
      flex: 0.8,
    },
    {
      field: 'fecha',
      type: 'date',
      align: 'center',
      headerAlign: 'center',
      valueGetter: (value) => {
        return new Date(value+'T00:00:00')
      },
      headerName: 'Fecha',
      flex: 0.5,
    },
    {
      field: 'horaInicio',
      align: 'center',
      headerAlign: 'center',
      type: 'string',
      valueGetter: (value) => {
        return value.split(':').slice(0, -1).join(':')
      },
      headerName: 'Inicio',
      flex: 0.3,
    },
    {
      field: 'horaFin',
      align: 'center',
      headerAlign: 'center',
      type: 'string',
      valueGetter: (value) => {
        return value.split(':').slice(0, -1).join(':')
      },
      headerName: 'Fin',
      flex: 0.3,
    },
    {
      field: 'operaciones',
      type: 'actions',
      headerName: 'Prestar',
      hide: !user.admin,
      flex: 0.3,
      getActions: ({ id, row }) => {
        return [
          <>
            <Button
              onClick={() => {
                setReservation(row)
                setOpen(true)
              }}
              className='p-2'
              variant='text'
            >
              <ClockCheckIcon />
            </Button>
          </>,
        ]
      },
    },
  ].filter((f) => !f.hide)

  return (
    <>
      <div className='h-full w-[1200px] max-w-full m-2'>
        <StyledDataGrid
          autoHeight
          columns={columns}
          rows={reservations}
          getRowId={(row) => row.id}
          loading={typeof reservations == 'undefined'}
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

      <Dialog open={open} handler={() => setOpen((prev) => !prev)}>
        <DialogHeader className='justify-center'>Préstamo</DialogHeader>
        <div className='p-8 pt-4'>
          {/* <NewReservation resource={reservation} setOpen={setOpen}/> */}
        </div>
      </Dialog>
    </>
  )
}
