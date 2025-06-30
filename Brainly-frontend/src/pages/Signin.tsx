import React from 'react'
import Input from '../Components/Input'
import { Button } from '../Components/Button'
import { BACKEND_URL } from '../Config';
import axios from 'axios';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function Signin() {
     const navigate = useNavigate();
     const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
   async function signin(){
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;
       
        
        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/signIn`,{
                username,
                password
            });
            const jwt = response.data.token;
            localStorage.setItem("token",jwt);
            
            alert("You are Login Up!");
            navigate("/dashboard");
            
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
            

            <Button onClick={signin} lodaing={false}  variant='primary' text='SignIn' size='lg' fullWidth={true} />
          </div>
    
    </div>
  )
}

export default Signin