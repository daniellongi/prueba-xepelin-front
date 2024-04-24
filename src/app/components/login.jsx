'use client'

import { useState, useEffect } from "react"
import fetchGoogleSheetData from "../functions/fetch-googlesheet"

export default function LogInBox(){

  const [ email, setEmail] = useState('')
  const [ password, setPassword] = useState('')

  function handleEmailChange(event){
    setEmail(event.target.value);
  }
  function handlePasswordChange(event){
    setPassword(event.target.value)
  }

  function checkLoginCredentials(event){
    console.log("el email a submitir es", email)
    console.log("la password a submitir es", password)
  }

  useEffect(  () => {
    console.log("el process env es", process.env.NEXT_PUBLIC_TESTEO)
    fetchGoogleSheetData();
  }, )

  const fetchGoogleSheetInformation = async () => {
    // const response = await 
  }


  return(
    <div className="relative flex min-h-screen text-gray-800 antialiased flex-col justify-center overflow-hidden bg-gray-50 py-6 sm:py-12">
      <div className="relative py-3 sm:w-96 mx-auto text-center">
        <span className="text-2xl font-light">Login to your account</span>
        <div className="mt-4 bg-white shadow-md rounded-lg text-left">
          <div className="h-2 bg-purple-400 rounded-t-md"></div>
          <div className="px-8 py-6">
            <label className="block font-semibold"> Username or Email </label>
            <input
              type="text"
              onChange={handleEmailChange}
              placeholder="Email"
              className="bg-white border w-full h-10 px-3 py-2 mt-2 hover:outline-none focus:outline-none focus:ring-indigo-500 focus:ring-1 rounded-md" 
            />
            <label className="block mt-3 font-semibold"> Password </label>
            <input
              autoComplete="new-password"
              type="password"
              onChange={handlePasswordChange}
              placeholder="Password"
              className="border w-full h-10 px-3 py-2 mt-2 hover:outline-none focus:outline-none focus:ring-indigo-500 focus:ring-1 rounded-md"
            />
            <div className="flex justify-between items-baseline">
              <button type="submit" onClick={checkLoginCredentials} className="mt-4 bg-purple-500 text-white py-2 px-6 rounded-md hover:bg-purple-600">
                Login
              </button>
              <a href="#" className="text-sm hover:underline">
                Forgot password?
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}