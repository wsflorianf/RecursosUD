import { useState } from 'react';
import { Input } from '@material-tailwind/react';
import EyeIcon from '../assets/icons/EyeIcon';
import EyeSlashIcon from '../assets/icons/EyeSlashIcon';
import { forwardRef } from 'react';

const InputPassword = forwardRef((props, ref)=> {
  const [showPassword, setShowPassword] = useState(false);
  
  // Función para alternar la visibilidad de la contraseña
  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
  };

  return (
    <Input
        type={showPassword ? 'text' : 'password'} // Cambia el tipo de input según el estado
        label="Contraseña"
        size="lg"
        className={'pr-10 '+props.className}
        icon={<div className='size-full cursor-pointer' onClick={togglePasswordVisibility}>{showPassword?<EyeSlashIcon/>:<EyeIcon/>}</div>}
        ref={ref}
        {...props}
      />
  );
})

export default InputPassword;
