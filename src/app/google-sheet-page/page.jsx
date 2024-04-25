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
        const googleSheetComplete = dateParsed.map((row)=> ({
          ...row,
          isEditing: false,
          edited: false,
        }))
        setgoogleSheetData(googleSheetComplete)
      } catch ( error ){
        console.log("hubo un error", error)
        return error
      }
    }
    fetchGoogleSheetData();
  }, [])

  function handleEditTasa(idOp){
    setgoogleSheetData((previousData)=>{
      return previousData.map((row) =>{
        if(row["id Op"] === idOp){
          return {
            ...row,
            isEditing: true
          }
        } else {
          return row
        }
      })
    })
  }

  function handleInputChange(event, idOp){
    setgoogleSheetData((previousData)=>{
      return previousData.map((row)=>{
        if(row["id Op"] === idOp){
          if( row.Tasa !== event.target.value){
            console.log("el event.target.value es", event.target.value);
            return {
              ...row,
              Tasa: event.target.value,
              edited: true
            }
          }
        }
        else{
          return row
        }
      })
    })
  }

  async function saveNewTasa(idOp){
    const rowToFind = googleSheetData.find( row => row["id Op"]===idOp)
    const body = {
      idOp: rowToFind['id Op'],
      tasa: rowToFind.Tasa,
      email: rowToFind.Email
    }

    const response = await axios.post(
      "https://hooks.zapier.com/hooks/catch/6872019/oahrt5g/",
      body,
    )

    console.log("el response es", response);


  }


  console.log("la data de google es", googleSheetData);

  return (
    <main>
      <div className="mx-5 my-5">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 mx-5 my-5">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                      <th scope="col" className="px-6 w-25 py-3">
                          Op Id
                      </th>
                      <th scope="col" className="px-6 w-25 py-3">
                          Tasa
                      </th>
                      <th scope="col" className="px-6 w-25 py-3">
                          Email
                      </th>
                      <th scope="col" className="px-6 w-25 py-3">
                          Acciones
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
                          <div>
                            {row["id Op"]}
                          </div>
                        </th>
                        <td className="px-6 w-25 py-4">
                          <div className="flex justify-start">
                            {
                              row.isEditing ?
                                <div>
                                  <input 
                                    type="text" 
                                    id="first_name" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500" 
                                    placeholder={row.Tasa}
                                    value={row.Tasa}
                                    onChange={(e)=>handleInputChange(e, row["id Op"])}
                                    />
                                </div>
                                :
                                <div className="w-full">
                                  {row.Tasa}
                                </div>
                            }
                           
                            
                          </div>
                        </td>
                        <td className="px-6 py-4">
                            {row.Email}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex">
                            <div className="">
                                <button 
                                  type="button" 
                                  className="px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:outline-none "
                                  onClick={() => handleEditTasa(row["id Op"])}

                                  >Editar</button>
                            </div>
                            <div className="mx-3">
                              <button type="button" className={
                                `px-3 py-2 text-xs font-medium text-center text-white ${!row.edited ? 'bg-blue-400 cursor-not-allowed': 'bg-blue-700 hover:bg-blue-800'} rounded-lg  focus:outline-none `}
                                onClick={()=> saveNewTasa(row['id Op'])}
                                >Guardar</button>
                            </div>
                          </div>
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