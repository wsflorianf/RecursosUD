import { Controller, useForm } from 'react-hook-form'
import useAppStore from '@/store/appStore'
import { Option, Typography } from '@material-tailwind/react'
import { Input } from '@material-tailwind/react'
import InputMessage from '@/components/InputMessage'
import { Button } from '@material-tailwind/react'
import { useState, useEffect } from 'react'
import { getUnits } from '@/api/units'
import { Select } from '@material-tailwind/react'
import { Textarea } from '@material-tailwind/react'
import { days } from '@/utils/utils'
import { createType } from '@/api/types'

export default function NewResourceType({ setTipos, setOpen }) {
  const { setLoading, setBarOptions } = useAppStore((state) => state)
  const [unidades, setUnidades] = useState([])
  const [horarioUnidad, setHorarioUnidad] = useState()

  const {
    register,
    control,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ mode: 'onChange' })

  useEffect(() => {
    const fetchUnidades = async () => {
      setLoading(true)
      try {
        const unidades = await getUnits()
        setUnidades(unidades.data)
      } catch (error) {
        if (error.code === 'ERR_NETWORK') setBarOptions('Error de Conexión')
        else if (error.response?.data?.message)
          setBarOptions(error.response.data.message)
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
      data['idUnit'] = Number(data['idUnit'])
      let horario = {}

      Object.keys(days).map((key) => {
        let inicio = data[key + '_start']
        let fin = data[key + '_end']

        horario[key] = {
          inicio,
          fin,
        }
      })

      data.horary = JSON.stringify(horario)

      const response = await createType(data)
      setBarOptions({
        message: 'Tipo de recurso creado con éxito.',
        color: 'green',
      })
      setTipos((prev) => [...prev, response.data])
      setOpen(false)
    } catch (error) {
      if (error.code === 'ERR_NETWORK') setError('Error de Conexión')
      else if (error.response?.data?.message)
        setError(error.response.data.message)
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
        {errors.name && <InputMessage message={errors.name.message} error />}
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
                  unidades.find((u) => u.id == val).horarioDisponibilidad
                )
                setHorarioUnidad(horario)
              }}
              error={errors.idUnit ? true : false}
            >
              {unidades.map((unidad) => (
                <Option key={unidad.nombre} value={unidad.id + ''}>
                  {unidad.nombre}
                </Option>
              ))}
            </Select>
          )}
        />

        {errors.idUnit && (
          <InputMessage message={errors.idUnit.message} error />
        )}
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
                  {...register(key + '_start', {
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
                  {...register(key + '_end', {
                    required: {
                      value: true,
                      message: 'Hora fin obligatoria',
                    },
                    validate: (val) => {
                      if (val < watch(key + '_start')) {
                        return 'Hora fin debe ser mayor.'
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
                {errors[key + '_start'] && (
                  <InputMessage
                    message={errors[key + '_start'].message}
                    error
                  />
                )}
                {errors[key + '_end'] && (
                  <InputMessage message={errors[key + '_end'].message} error />
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
