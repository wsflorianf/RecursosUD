import { Typography } from '@material-tailwind/react'
import { Card } from '@material-tailwind/react'

export default function TimeTable({ horary }) {
  const dias = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
  ]

  return (
    <Card className='h-full w-full overflow-hidden'>
      <table className='w-full min-w-max table-auto text-left'>
        <thead>
            <tr>
          {dias.map((dia) => (
            <th
              key={dia}
              className='border-b border-gray-100 bg-gray-300 p-4'
            >
              <Typography
                variant='small'
                color='blue-gray'
                className='font-bold leading-none opacity-80 text-center'
              >
                {dia}
              </Typography>
            </th>
          ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {dias.map((dia, index) => {
              let d = dia
                .normalize('NFD')
                .replace(/([aeio])\u0301|(u)[\u0301\u0308]/gi, '$1$2')
                .toLowerCase()
              return (
                <td className={index%2==0?"p-4 border-b border-blue-gray-50 bg-gray-100":"p-4 border-b border-blue-gray-50"} key={index+'hora'}>
                  <Typography
                    variant='small'
                    color='blue-gray'
                    className='font-normal text-center'
                  >
                    {horary[d].inicio + ' - ' + horary[d].fin}{' '}
                  </Typography>
                </td>
              )
            })}
          </tr>
        </tbody>
      </table>
    </Card>
  )
}
