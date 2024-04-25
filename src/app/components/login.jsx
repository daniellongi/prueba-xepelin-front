'use client'

import { useRouter } from 'next/navigation';

import { useState } from "react"
export default function LogInBox(){

  const router = useRouter();
  const email = "pruebaxepelin@gmail.com"
  const password = "1234"
  const [ inputEmail, setinputEmail] = useState('')
  const [ inputPassword, setinputPassword] = useState('')
  const [ mailValid, setmailValid] = useState(true)

  function handleEmailChange(event){
    setinputEmail(event.target.value);
    const validMail = mailIsValid(event.target.value)
    if(validMail){
      return setmailValid(true)
    }
    setmailValid(false);
  }

  function handlePasswordChange(event){
    setinputPassword(event.target.value)
  }

  function checkLoginCredentials(event){
    if(email == inputEmail && inputPassword == password && setmailValid){
      router.push('/google-sheet-page');
    }
  }

  function mailIsValid(email){
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  return(
    <div className="relative flex min-h-screen text-gray-800 antialiased flex-col justify-center overflow-hidden bg-gray-50 py-6 sm:py-12">
      <div className="relative py-3 sm:w-96 mx-auto text-center">
        <span className="text-2xl font-light">Ingrese a su cuenta</span>
        <div className="mt-4 bg-white shadow-md rounded-lg text-left">
          <div className="h-2 bg-purple-400 rounded-t-md"></div>
          <div className="px-8 py-6">
            <label className="block font-semibold">Mail</label>
            {
              !mailValid && (
                <div className='text-red-400'>
                  Ingrese un mail valido
                </div>
              )
            }
            
            <input
              type="text"
              onChange={handleEmailChange}
              placeholder="Email"
              className="bg-white border w-full h-10 px-3 py-2 mt-2 hover:outline-none focus:outline-none focus:ring-indigo-500 focus:ring-1 rounded-md" 
            />
            <label className="block mt-3 font-semibold">Contraseña </label>
            <input
              autoComplete="new-password"
              type="password"
              onChange={handlePasswordChange}
              placeholder="Password"
              className="border w-full h-10 px-3 py-2 mt-2 hover:outline-none focus:outline-none focus:ring-indigo-500 focus:ring-1 rounded-md"
            />
            <div className="flex justify-center items-baseline">
              <button type="submit" onClick={checkLoginCredentials} className="mt-4 bg-purple-500 text-white py-2 px-6 rounded-md hover:bg-purple-600">
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}