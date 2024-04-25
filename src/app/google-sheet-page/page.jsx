'use client'
import { useEffect, useState } from "react"
import axios from 'axios';
import parseCSV from "../functions/parse-csv";
import SuccessToast from "../components/success-toast";
import FailedToast from "../components/failed-toast";

export default function GoogleSheetPage(){

  const [ googleSheetData, setgoogleSheetData] = useState([]);
  const [ successModal, setsuccessModal ] = useState(false);
  const [ successMessage, setsucessMessage] = useState({
    tasa: "",
    email: "",
  })
  const [ failedModal, setfailedModal] = useState(false);
  const [ loading, setloading ] = useState(true);

  useEffect( () => {
    const fetchGoogleSheetData = async () =>{
      try{
        const googleSheetData = await axios.get("https://docs.google.com/spreadsheets/d/e/2PACX-1vQWuSXiTr8Q1hcn4nEBlqffbESeO9dGm6kHr2J--iJpHw5K4sY7t1y4xKabYW21iSXt_Z_NJJGwXErU/pub?output=csv") 
        const dateParsed = parseCSV(googleSheetData.data);
        const googleSheetComplete = dateParsed.map((row)=> ({
          ...row,
          isEditing: false,
          edited: false,
        }));
        setgoogleSheetData(googleSheetComplete);
        setloading(false)
      } catch ( error ){
        setloading(false)
        return error;
      }
    };
    fetchGoogleSheetData();
  }, []);

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
    let response = await axios.post('https://hooks.zapier.com/hooks/catch/6872019/oahrt5g/', body,
    {
      headers : {
        'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
    }})

    if(response.status === 200){
      setsucessMessage({
        tasa: rowToFind.Tasa,
        email: rowToFind.Email
      })
      setsuccessModal(true);
      setgoogleSheetData(
        (previosData)=>{
          return previosData.map((row)=>{
            if(row['id Op'] === rowToFind['id Op']){
              return {
                ...row,
                edited:false,
              }
            } else {
              return row
            }
          })
        }
      )
    } else {
      setfailedModal(true);
    }

  }
  
  return (
    <main>
      <div>
        {
          loading ? (
            <div className="flex justify-center items-center h-screen">
              <div role="status">
                <svg aria-hidden="true" className="w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          ) : (
            <div>
              <div>
                <SuccessToast
                  show={successModal}
                  setShow={setsuccessModal}
                  message={successMessage}
                />
              </div>
              <div>
                <FailedToast
                  show={failedModal}
                  setShow={setfailedModal}
                />
              </div>
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
            </div>
          )
        }
      </div>

    </main>
  )
}