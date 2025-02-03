import { Typography } from '@material-tailwind/react'
import { Button } from '@material-tailwind/react'
import { Input } from '@material-tailwind/react'
import { useForm } from 'react-hook-form'
import InputMessage from '../InputMessage'
import { days } from '@/utils/utils'

export default function NewReservation({ resource }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const unitHorary = JSON.parse(resource.horarioDisponibilidad)

  const validateTime = (timeS, timeE) => {
    const [h, m] = resource.tiempoMin
      .split(':')
      .slice(0, -1)
      .map((t) => Number(t))
    const [hTimeS, mTimeS] = timeS.split(':').map((t) => Number(t))
    const [hTimeE, mTimeE] = timeE.split(':').map((t) => Number(t))

    return (hTimeE * 60 + mTimeE - (hTimeS * 60 + mTimeS)) % (h * 60 + m) == 0
  }

  const getHoraryDay = (day) => {
    let keys = Object.keys(days)

    if (day == 0) {
      return unitHorary[keys[6]]
    }

    return unitHorary[keys[day - 1]]
  }

  const onSubmit = async (data) => {}

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='mb-1 flex flex-col gap-3'>
        <p className='font-bold text-lg'>
          Identificador:{' '}
          <span className='font-normal'>{resource.identificador}</span>
        </p>
        <p className='font-bold text-lg'>
          Nombre: <span className='font-normal'>{resource.nombre}</span>
        </p>
        <p className='font-bold text-lg'>
          Tiempo mínimo (hh:mm):{' '}
          <span className='font-normal'>
            {resource.tiempoMin.split(':').slice(0, -1).join(':')}
          </span>
        </p>
        <p className='font-bold text-lg'>Fecha: </p>
        <Input
          error={errors.date ? true : false}
          id='fecha-reserva'
          size='lg'
          type='date'
          variant='standard'
          {...register('date', {
            required: { value: true, message: 'Este campo es obligatirio.' },
          })}
        />
        {errors.date && <InputMessage message={errors.date.message} error/>}
        <p className='font-bold text-lg'>Hora: </p>
        <div className='flex gap-8'>
          <Input
            error={errors.start ? true : false}
            label='Inicio'
            type='time'
            variant='standard'
            {...register('start', {
              required: {
                value: true,
                message: 'La hora inicio es obligatoria.',
              },
              validate: (val) => {
                let horary = getHoraryDay(
                  new Date(watch('date') + 'T00:00:00').getDay()
                )

                if (val < horary.inicio || val > horary.fin)
                  return 'La hora inicio está fuera de rango.'

                if (!validateTime(watch('start'), watch('end')))
                  return 'El rango establecido no es correcto.'
              },
            })}
          />

          <Input
            error={errors.end ? true : false}
            label='Fin'
            type='time'
            variant='standard'
            {...register('end', {
              required: {
                value: true,
                message: 'La hora fin es obligatoria.',
              },
              validate: (val) => {
                let horary = getHoraryDay(
                  new Date(watch('date') + 'T00:00:00').getDay()
                )

                if (
                  val < horary.inicio ||
                  val > horary.fin ||
                  val < watch('start')
                )
                  return 'La hora fin está fuera de rango.'

                if (!validateTime(watch('start'), watch('end')))
                  return 'El rango establecido no es correcto.'
              },
            })}
          />
        </div>
        <InputMessage
          message={'La hora debe ser múltiplo de la hora mínima.'}
        />
        {errors.start && <InputMessage message={errors.start.message} error />}
        {errors.end && <InputMessage message={errors.end.message} error />}
        <br />
        <Button type='submit' fullWidth>
          Reservar
        </Button>
      </div>
    </form>
  )
}
