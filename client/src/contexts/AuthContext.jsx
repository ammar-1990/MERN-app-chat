import { createContext,useContext,useEffect,useReducer } from "react";



export const AuthContext = createContext()



 // eslint-disable-next-line react/prop-types
 export const  AuthContextProvider = ({children})=>{


    const authReducer = (state,action)=>{

        switch(action.type){
case "LOG_IN" : return {user:action.payload,loading:false};
case "LOG_OUT": return {user:null,loading:false};
default: return state


        }

    }

const INITIAL_STATE = {
user:null,
loading:true

}
 const [state,dispatch] = useReducer(authReducer,INITIAL_STATE)



useEffect(()=>{

    const user = localStorage.getItem('user')
    if(user){

      
        dispatch({type:"LOG_IN",payload:JSON.parse(user)})
    }
    else{
        dispatch({type:'LOG_OUT'})
    }
},[])
return (
    <AuthContext.Provider value={{...state,dispatch}}>
        {children}
    </AuthContext.Provider>
)
}






// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = ()=>useContext(AuthContext)
