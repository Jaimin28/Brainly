import React, { useRef } from 'react'
import Input from '../Components/Input'
import { Button } from '../Components/Button'
import axios from 'axios';
import { BACKEND_URL } from '../Config';
import { useNavigate } from 'react-router-dom';

function SIgnUp() {
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
     const navigate = useNavigate();
   async function signup(){
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;
       
        try {
            await axios.post(`${BACKEND_URL}/api/v1/signUp`,{
                username,
                password
            });
            alert("You are Signed Up!");
            navigate("/signin");
        } catch (error) {
            console.log(error);
            alert("SignUp Failed,please try agian");
            
            
        }
        

    }
  return (
    <div className='h-screen w-screen bg-gray-200 flex justify-center items-center'>
          <div className='bg-white flex flex-col p-5 justify-center items-center rounded border min-w-48 '>
            <Input ref={usernameRef} placeholder='Username'/>
            <Input ref={passwordRef} placeholder='Password'/>
            

            <Button onClick={signup}  lodaing={false}  variant='primary' text='SignUp' size='lg' fullWidth={true} />
          </div>
    
    </div>
  )
}

export default SIgnUp