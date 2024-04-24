'use client'
import { useEffect, useState } from "react"
import axios from 'axios';
import parseCSV from "../functions/parse-csv";

export default function GoogleSheetPage(){

  const [ googleSheetData, setgoogleSheetData] = useState([])

  useEffect( () => {
    const fetchGoogleSheetData = async () =>{
      try{
        const googleSheetData = await axios.get("https://docs.google.com/spreadsheets/d/e/2PACX-1vQWuSXiTr8Q1hcn4nEBlqffbESeO9dGm6kHr2J--iJpHw5K4sY7t1y4xKabYW21iSXt_Z_NJJGwXErU/pub?output=csv") 
        const dateParsed = parseCSV(googleSheetData.data)
        setgoogleSheetData(dateParsed)
      } catch ( error ){
        console.log("hubo un error", error)
        return error
      }
    }
    fetchGoogleSheetData();
  }, [])

  console.log("la data de google es", googleSheetData);

  return (
    <main>
      <div className="relative overflow-x-auto mx-5 my-5">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 mx-5 my-5">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                      <th scope="col" className="px-6 py-3">
                          Op Id
                      </th>
                      <th scope="col" className="px-6 py-3">
                          Tasa
                      </th>
                      <th scope="col" className="px-6 py-3">
                          Email
                      </th>
                  </tr>
              </thead>
              <tbody>
                  {
                    googleSheetData.map((row, index) => (
                      <tr 
                        key={index}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {row["id Op"]}
                        </th>
                        <td className="px-6 py-4">
                            {row.Tasa}
                        </td>
                        <td className="px-6 py-4">
                            {row.Email}
                        </td>
                      </tr>
                    ))
                  }
                  
              </tbody>
          </table>
      </div>
    </main>
  )
}