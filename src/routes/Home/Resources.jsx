import { useState } from 'react'
import { useEffect } from 'react'
import useAppStore from '../../store/appStore'
import StyledDataGrid from '../../components/styled/StyledDataGrid'
import CalendarIcon from '../../assets/icons/CalendarIcon'
import { Button, DialogHeader } from '@material-tailwind/react'
import { Dialog } from '@material-tailwind/react'
import TimeTable from '../../components/TimeTable'
import NewResourceType from '../../components/forms/NewResourceType'
import { useAuthStore } from '@/store/authStore'
import { getResources } from '@/api/resources'
import NewReservation from '@/components/forms/NewReservation'
import ClockCheckIcon from '@/assets/icons/ClockCheckIcon'

export default function Resources() {
  const [open, setOpen] = useState(false)
  const [openNew, setOpenNew] = useState(false)
  const [resource, setResource] = useState()
  const { setLoading, setBarOptions, loading } = useAppStore((state) => state)
  const [resources, setResources] = useState([])
  const user = useAuthStore(state=>state.user)

  useEffect(() => {
    const fetchUnidades = async () => {
      setLoading(true)
      try {
        const resources = await getResources()
        setResources(resources.data)
      } catch (error) {
        if(error.code==="ERR_NETWORK") setBarOptions({message: "Error de Conexión", color: 'red'})
        else setBarOptions({message: error.response.data.mensaje, color: 'red'})
      } finally {
        setLoading(false)
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
    {
      field: 'identificador',
      type: 'string',
      headerName: 'Identificador',
      flex: 0.5,
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
    },
    { field: 'nombreTipo', type: 'string', headerName: 'Tipo de recurso', flex: 0.7 },
    { field: 'nombre', type: 'string', headerName: 'Nombre', flex: 0.7 },
    {
      field: 'caracteristicas',
      type: 'string',
      headerName: 'Características',
      flex: 1,
    },
    {
      field: 'operaciones',
      type: 'actions',
      headerName: 'Reservar',
      hide: user.admin,
      flex: 0.3,
      getActions: ({ id, row }) => {
        return [
          <Button
            onClick={() => {
              setResource(row)
              setOpen(true)
            }}
            className='p-2'
            variant='text'
          >
            <ClockCheckIcon />
          </Button>,
        ]
      },
    },
  ].filter(f=>!f.hide)

  return (
    <>
      {user.admin && <Button onClick={() => setOpenNew(true)}>Nuevo</Button>}
      <div className='h-full w-[1200px] max-w-full m-2'>
        <StyledDataGrid
          autoHeight
          columns={columns}
          rows={resources}
          getRowId={(row) => row.id}
          loading={loading}
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
        <DialogHeader className='justify-center'>
          Reserva
        </DialogHeader>
        <div className='p-8 pt-4'>
          <NewReservation resource={resource}/>
        </div>
      </Dialog>

      <Dialog className='overflow-hidden' size='xl' open={openNew} handler={() => setOpenNew((prev) => !prev)}>
        <DialogHeader className='justify-center bg-gray-300'>
          Nuevo Tipo de Recurso
        </DialogHeader>
        <div className='p-8 pt-4'>
          <NewResourceType setResources={setResources} setOpen={setOpenNew}/>
        </div>
      </Dialog>
    </>
  )
}
