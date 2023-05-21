import {  useState } from "react";
import { newAxios } from "../util/newAxios";
import { useAuth } from "../contexts/AuthContext";
import {Link, useNavigate} from 'react-router-dom'



const Register = () => {
const navigate = useNavigate()
const [username, setUsername] = useState('')
const [password, setPassword] = useState('')
const [rLoading,setRLoading] = useState(false)
const [rError, setRError] = useState('')


const {dispatch} = useAuth()

const handleSubmit = async (e)=> {
e.preventDefault()
setRError('')
  setRLoading(true)

  try {
    const res = await newAxios.post(`/auth/register`,{username,password})
 dispatch({type:'LOG_IN',payload:res.data})
 localStorage.setItem('user',JSON.stringify(res.data))
 navigate('/chat',{replace:true})
  } catch (error) {
   setRError(error)
  }finally{
    setRLoading(false)
    setUsername('')
    setPassword('')
  }


}





  return (
    <div className={`h-screen bg-black  flex items-center `}>
      <form className="max-w-[500px] mx-auto mb-12 flex flex-col gap-7 w-full p-4">
        <h1 className="text-6xl font-bold text-white mb-7 cursor-default">Register<span className="text-indigo-600">.</span></h1>

        <input required type="text" placeholder="username" className="input"  onChange={e=>setUsername(e.target.value)} value={username} />
        <input
          required
          min={6}
          type="password"
          placeholder="password"
          className="input"
          onChange={e=>setPassword(e.target.value)}
          value={password}
        />
        <button disabled={rLoading || !username || !password} onClick={handleSubmit} className={`btn ${rLoading && 'cursor-progress'} disabled:bg-gray-400 disabled:border-gray-400`}>{rLoading? 'Loading...' : 'Register'}</button>
     <p className="text-white py-1">Already have an account? <Link to={'/login'}><span className="hover:underline">Login.</span></Link></p>
     {rError&&<p className="text-xs text-red-500 pt-4 uppercase">{rError.response.data}</p>}
     
      </form>
    </div>
  );
};

export default Register;
