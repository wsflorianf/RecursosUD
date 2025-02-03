import { useState } from 'react'
import { useEffect } from 'react'
import { getUnits } from '../../api/units'
import useAppStore from '../../store/appStore'
import StyledDataGrid from '../../components/styled/StyledDataGrid'
import CalendarIcon from '../../assets/icons/CalendarIcon'
import { Button, DialogHeader } from '@material-tailwind/react'
import { Dialog } from '@material-tailwind/react'
import TimeTable from '../../components/TimeTable'
import { getTypes } from '../../api/types'
import NewResourceType from '../../components/forms/NewResourceType'

export default function ResourceTypes() {
  const [open, setOpen] = useState(false)
  const [openNew, setOpenNew] = useState(false)
  const [horary, setHorary] = useState()
  const { setLoading, setBarOptions, loading } = useAppStore((state) => state)
  const [tipos, setTipos] = useState()

  useEffect(() => {
    const fetchUnidades = async () => {
      try {
        const tipos = await getTypes()
        setTipos(tipos.data)
      } catch (error) {
        if (error.code === 'ERR_NETWORK')
          setBarOptions({ message: 'Error de Conexión', color: 'red' })
        else
          setBarOptions({ message: error.response.data.mensaje, color: 'red' })

          setTipos([])
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
    { field: 'nombreUnidad', type: 'string', headerName: 'Unidad', flex: 0.7 },
    { field: 'nombre', type: 'string', headerName: 'Nombre', flex: 0.7 },
    {
      field: 'descripcion',
      type: 'string',
      headerName: 'Descripción',
      flex: 1,
    },
    {
      field: 'caracteristicas',
      type: 'string',
      headerName: 'Características',
      flex: 1,
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

  return (
    <>
      <Button onClick={() => setOpenNew(true)}>Nuevo</Button>
      <div className='h-full w-[1200px] max-w-full m-2'>
        <StyledDataGrid
          autoHeight
          columns={columns}
          rows={tipos}
          getRowId={(row) => row.id}
          loading={typeof tipos == 'undefined'}
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

      <Dialog
        className='overflow-hidden'
        size='xl'
        open={openNew}
        handler={() => setOpenNew((prev) => !prev)}
      >
        <DialogHeader className='justify-center bg-gray-300'>
          Nuevo Tipo de Recurso
        </DialogHeader>
        <div className='p-8 pt-4'>
          <NewResourceType setTipos={setTipos} setOpen={setOpenNew} />
        </div>
      </Dialog>
    </>
  )
}
