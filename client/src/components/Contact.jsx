import Avatar from "./Avatar"

const Contact = ({chosen,el,online,username,id}) => {
  return (
    <div

 


    className={`text-white p-3 capitalize  flex items-center gap-3 cursor-pointer ${
   online&&   chosen !== el && "hover:bg-slate-900" 
    }   ${
      !online && chosen !== id && "hover:bg-slate-900" 
      }  duration-300 ${chosen === el  && "bg-indigo-600"} ${!online && chosen === id  && "bg-indigo-600"}`}
  >
    <Avatar username={username} userId={online ?el : id} online={online} />
    <p>{username}</p>
  </div>
  )
}

export default Contact