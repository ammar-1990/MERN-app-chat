import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid";
import Avatar from "../components/Avatar";

const Chat = () => {
  const { user } = useAuth();
  const [ws, setWs] = useState(null);
  const [peopleOnline, setPeopleOnline] = useState({});
  const [chosen, setChosen] = useState("");
  const [newMessage, setNewMessage] = useState('')
  const [messages ,setMessages] = useState([])


const handleSending = (e)=>{
e.preventDefault()
console.log('send')
ws.send(JSON.stringify({
   
        reciever:chosen,
        text:newMessage
    
}))
setMessages(prev=>[...prev,{text:newMessage,isOur:true}])
setNewMessage('')
console.log(messages)
}

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8800");
    setWs(ws);

    ws.addEventListener("message", handleMessage);
  }, []);

  function handleMessage(e) {
    const data = JSON.parse(e.data);
    if ("online" in data) {
      let people = {};
      data.online.forEach(({ userId, username }) => {
        people[userId] = username;
      });
      setPeopleOnline(people);
    }
    else{
        setMessages(prev=>[...prev,{text:data.text,isOur:false}])
        console.log(data)
    }
  }
  
  return (
    <div className="h-screen flex">
      <div className="min-w-[300px] bg-black">
        <div className="text-3xl text-white font-bold flex items-center justify-center gap-3 mb-12 py-4">
          <ChatBubbleLeftRightIcon className="text-indigo-600 w-7" />
          <h1>
            Alpha Chat <span className="text-indigo-600">.</span>
          </h1>
        </div>

        <div className=" ">
          {Object.keys(peopleOnline).map((el) => {
            if(user?.username !== peopleOnline[el])
           return  <div
              onClick={() => setChosen(el)}
              key={el}
              className={`text-white p-3 capitalize  flex items-center gap-3 cursor-pointer ${
                chosen !== el && "hover:bg-slate-900"
              } duration-300 ${chosen === el && "bg-indigo-600"}`}
            >
              <Avatar username={peopleOnline[el]} userId={el} />
              <p>{peopleOnline[el]}</p>
            </div>
          })}
        </div>
      </div>

      <div className="flex-1 bg-slate-200 py-5 p-3 flex flex-col">
        <div className="flex-1">
            {chosen && messages.map((el,i)=><p className={`${el.isOur && 'text-right bg-blue-300'}`} key={i}>{el.text}</p>)}

            {!chosen && <div className="h-full flex items-center justify-center text-slate-400 text-5xl font-bold">&larr;Select a person </div>}
        </div>

       {chosen && <form onSubmit={handleSending} className="flex gap-2">
          <input
          value={newMessage}
          onChange={e=>setNewMessage(e.target.value)}
            type="text"
            placeholder="write your message"
            className="flex-1 focus:shadow-md focus:shadow-zinc-500  p-3 rounded-md outline-none  duration-300"
          />
          <button disabled={!newMessage.trim()} className="disabled:bg-gray-400 bg-indigo-600 w-12 flex items-center justify-center hover:bg-indigo-700 rounded-md  duration-300">
            <PaperAirplaneIcon className="text-white h-6" />
          </button>
        </form>}
      </div>
    </div>
  );
};

export default Chat;
