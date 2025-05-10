import { createContext  , useCallback, useState} from "react";
import { postRequest } from "../utils/services";



export const AuthContext = createContext()


export const AuthContextProvider = ({children})=>{

    const [user , setUser] = useState(null)
    const [registerError , setRegisterError]= useState(null)
    const [isRegisterLoading , setIsRegisterLoading]= useState(false)
    const [registerInfo , setRegisterInfo] =  useState({
        fullName : '',
        email : '',
        password : '',
    })



    console.log("registerInfo" , registerInfo)

    const updateRegisterInfo = useCallback((info) =>{
        setRegisterInfo(info)
    },[])


    const registerUser = useCallback(async(e)=> {
        e.preventDefault()
        setIsRegisterLoading(true)
        setRegisterError(null)
        try {
            console.log('Sending:', registerInfo);
            const response = await postRequest(`${import.meta.env.VITE_BASE_URL}/auth/sign-up`, JSON.stringify(registerInfo))

            setIsRegisterLoading(false)
        
            if(response.error){
                setRegisterError(response)
                return;
            }

            localStorage.setItem("User" , JSON.stringify(response))

            setUser(response)
        } finally {
            setIsRegisterLoading(false)
        }
        
    } ,[registerInfo])



    return <AuthContext.Provider value={{
        user ,
        registerInfo,
        updateRegisterInfo,
        registerUser ,
        registerError ,
        isRegisterLoading ,
    }}> {children} </AuthContext.Provider>
}