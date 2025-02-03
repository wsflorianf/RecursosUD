import { Controller, useForm } from 'react-hook-form'
import useAppStore from '@/store/appStore'
import { Option, Typography } from '@material-tailwind/react'
import { Input } from '@material-tailwind/react'
import InputMessage from '@/components/InputMessage'
import { Button } from '@material-tailwind/react'
import { useState, useEffect } from 'react'
import { Select } from '@material-tailwind/react'
import { Textarea } from '@material-tailwind/react'
import { days } from '@/utils/utils'
import { createType, getTypes } from '@/api/types'

export default function NewResource({ setTipos, setOpen }) {
  const { setLoading, setBarOptions } = useAppStore((state) => state)
  const [tipos, setTipos] = useState([])
  const [horarioUnidad, setHorarioUnidad] = useState()

  const {
    register,
    control,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({mode: 'onChange'})

  useEffect(() => {
    const fetchUnidades = async () => {
      setLoading(true)
      try {
        const tipos = await getTypes()
        setTipos(tipos.data)
      } catch (error) {
        if (error.code === 'ERR_NETWORK') setBarOptions({message: 'Error de Conexión', color: 'red'})
        else console.log(error)
      } finally {
        setLoading(false)
      }
    }

    fetchUnidades()
  }, [])

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      data['idResourceType'] = Number(data['idResourceType'])

      let nuevoTipo = {
        name: data.name,
        idUnit: data.idUnit,
        description: data.description,
        characteristics: data.characteristics,
        horary: horario,
      }

      const response = await createType(nuevoTipo)
      setBarOptions({message: "Tipo de recurso creado con éxito.", color: 'green'})
      setTipos(prev=>[...prev, response.data])
      setOpen(false)
    } catch (error) {
      console.log(error)
      if (error.code === 'ERR_NETWORK') setError('Error de Conexión')
      else if (error.response?.data?.mensaje) setError(error.response.data.mensaje)
      else console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='mb-1 flex flex-col gap-3'>
        <Input
          size='lg'
          placeholder='Mi unidad'
          label='Nombre'
          variant='standard'
          error={errors.name ? true : false}
          {...register('name', {
            required: {
              value: true,
              message: 'Este campo es obligatorio.',
            },
            minLength: {
              value: 4,
              message: 'El nombre debe contener mínimo 4 caracteres.',
            },
          })}
        />
        {errors.name && <InputMessage message={errors.name.message} error/>}
        <Controller
          control={control}
          name='idUnit'
          rules={{
            required: {
              value: true,
              message: 'Debe seleccionar una unidad de servicio.',
            },
          }}
          render={({ value, ...field }) => (
            <Select
              required
              label='Unidad de servicio'
              variant='standard'
              onChange={(val) => {
                setValue('idUnit', val)

                let horario = JSON.parse(
                  tipos.find((u) => u.id == val).horarioDisponibilidad
                )
                setHorarioUnidad(horario)
              }}
              error={errors.idUnit ? true : false}
            >
              {tipos.map((unidad) => (
                <Option key={unidad.nombre} value={unidad.id + ''}>
                  {unidad.nombre}
                </Option>
              ))}
            </Select>
          )}
        />

        {errors.idUnit && <InputMessage message={errors.idUnit.message} error/>}
        <Textarea
          resize={true}
          label='Descripción'
          variant='standard'
          {...register('description')}
        />
        <Textarea
          resize={true}
          label='Características'
          variant='standard'
          {...register('characteristics')}
        />

        <div className='grid grid-cols-7 gap-6'>
          {Object.entries(days).map(([key, day]) => {
            return (
              <div key={key} className='flex flex-col gap-4'>
                <Typography>{day}</Typography>
                <Input
                  containerProps={{ className: 'min-w-full max-w-full' }}
                  label='Inicio'
                  variant='standard'
                  type='time'
                  {...register(key + '_inicio', {
                    required: {
                      value: true,
                      message: 'Hora inicio obligatoria',
                    },
                    max: {
                      value: horarioUnidad ? horarioUnidad[key].fin : '00:00',
                      message: `Hora inicio fuera de rango.`,
                    },
                    min: {
                      value: horarioUnidad
                        ? horarioUnidad[key].inicio
                        : '00:00',
                      message: `Hora inicio fuera de rango.`,
                    },
                  })}
                />
                <Input
                  containerProps={{ className: 'min-w-full max-w-full' }}
                  label='Fin'
                  variant='standard'
                  type='time'
                  {...register(key + '_fin', {
                    required: {
                      value: true,
                      message: 'Hora fin obligatoria',
                    },
                    validate: (val)=>{
                      if(val<watch(key + '_inicio')){
                        return "Hora fin debe ser mayor."
                      }
                    },
                    max: {
                      value: horarioUnidad ? horarioUnidad[key].fin : '00:00',
                      message: `Hora fin fuera de rango.`,
                    },
                    min: {
                      value: horarioUnidad
                        ? horarioUnidad[key].inicio
                        : '00:00',
                      message: `Hora fin fuera de rango.`,
                    },
                  })}
                />
                {errors[key + '_inicio'] && (
                  <InputMessage message={errors[key + '_inicio'].message} error/>
                )}
                {errors[key + '_fin'] && (
                  <InputMessage message={errors[key + '_fin'].message} error/>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <Button variant='gradient' className='mt-6' fullWidth type='submit'>
        Crear
      </Button>
    </form>
  )
}
