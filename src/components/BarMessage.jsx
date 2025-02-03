import { Alert } from "@material-tailwind/react"
import useAppStore from "../store/appStore"

export default function BarMessage ()  {

    const barOptions = useAppStore(state=>state.barOptions)

  return (
    <Alert
      className='w-96 bottom-4 right-4 fixed z-[999999]'
      open={Boolean(barOptions.message)}
      color={barOptions.color}
      variant='gradient'
      animate={{
        mount: { y: 0 },
        unmount: { y: 200 },
      }}
    >
      {barOptions.message}
    </Alert>
  )
}
