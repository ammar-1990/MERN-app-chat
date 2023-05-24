import { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid";
import { Navigate } from "react-router-dom";
import { newAxios } from "../util/newAxios";
import Contact from "../components/Contact";
import { PaperClipIcon } from "@heroicons/react/24/outline";
import { ChatBubbleOvalLeftIcon } from "@heroicons/react/24/outline";

const Chat = () => {
  const { user, loading: authLoad, dispatch } = useAuth();
  const [loading, setLoading] = useState(true);
  const [ws, setWs] = useState(null);
  const [peopleOnline, setPeopleOnline] = useState({});
  const [chosen, setChosen] = useState("");
  const [newMessage, setNewMessage] = useState("");

  const [messages, setMessages] = useState([]);
  const theRef = useRef();
  const [disconnected, setDisconnected] = useState(false);
  const [users, setUsers] = useState([]);
  const [peopleOffline, setPeopleOffline] = useState([]);
  const [file, setFile] = useState(null);
  const [drawer,setDrawer]= useState(false)

  const handleSending = (e, file) => {

      e.preventDefault();
    
setTimeout(()=>{  ws.send(
  JSON.stringify({
    reciever: chosen,
    text: newMessage,
    file,
  })
);
if (file) {
  setLoading(true);
  setTimeout(()=>{ newAxios(`messages/${chosen}`).then((res) => {
    setMessages(res.data);
    setLoading(false);},1000)
 
  });
} else {
  if (newMessage !== "") {
    setMessages((prev) => [
      ...prev,
      { text: newMessage, sender: user._id, reciever: chosen },
    ]);
  }



}
setNewMessage("");
setFile(null);
},1000)
  

    
  };
  async function reconnect() {
    setDisconnected(true);

    await new Promise((res) =>
      setTimeout(() => {
        res();
      }, 2000)
    );
    connectToWS();
  }
  function connectToWS() {
 
    
    console.log("ws connected");
    const ws = new WebSocket("wss://api-chat-ukxi.onrender.com");

    setWs(ws);
    setDisconnected(false);

    ws.addEventListener("message", handleMessage);
    ws.onclose = (event) => {
      console.log(event);
      if (event.code === 1006) {
        reconnect();
      }
    };
  }

  useEffect(() => {
    if(ws&&chosen){
      ws.close()
    }
    connectToWS();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chosen]);

  useEffect(() => {
    if (!loading) {
      theRef.current.scrollIntoView({ behavior: "smooth" });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  useEffect(() => {
    
    if (chosen) {
      setMessages([]);
      setLoading(true);
      newAxios(`messages/${chosen}`).then((res) => {
        setMessages(res.data);
        setLoading(false);
      });
    }
  }, [chosen]);

  function handleMessage(e) {

 

    const data = JSON.parse(e.data);
 



    if ("online" in data) {
      let people = {};
      data?.online?.forEach(({ userId, username }) => {
        people[userId] = username;
      });
      setPeopleOnline(people);
    } else {
      console.log('chosen',chosen);
    if(chosen === data?.sender)
       { setMessages((prev) => [...prev, { ...data }]);}
      
    }
  }

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await newAxios.get("/users");
        const data = await res.data;

        setUsers(data);
      } catch (error) {
        console.log(error);
      }
    };

    getUsers();
  }, []);

  useEffect(() => {
    if (users?.length > 0) {
      const onlineUsersArr = Object.entries(peopleOnline)?.map(
        ([_id, name]) => ({ _id, name })
      );
      const offlineUsers = users?.filter((user) => {
        return !onlineUsersArr?.find(
          (onlineUser) => onlineUser?._id === user?._id
        );
      });

      setPeopleOffline(offlineUsers);
    }
  }, [peopleOnline, users]);

  const handleLogout = async () => {
    try {
      const res = await newAxios.post("/auth/logout");
      console.log(res.data);
      dispatch({ type: "LOG_OUT" });
      localStorage.removeItem("user");
      ws.removeEventListener("close", reconnect);

      ws.close();
    } catch (error) {
      console.log(error);
    }
  };

  const sendFile = async (e) => {
    const reader = new FileReader();

    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      setFile({ data: reader.result, name: e.target.files[0].name });
    };
  };

  if (!user && authLoad)
    return (
      <div className="h-screen w-full text-gray-700 text-5xl flex items-center justify-center animate-pulse">
        loading..
      </div>
    );
  if (!user && !authLoad) return <Navigate to={"/login"} />;
  return (
    <div className="h-screen flex">
       <div className="fixed bottom-28 right-4 w-12 h-12  flex md:hidden bg-indigo-600  items-center justify-center cursor-pointer rounded-br-lg rounded-tl-lg" onClick={()=>setDrawer(prev=>!prev)}><ChatBubbleOvalLeftIcon  className="h-5 text-white"/></div>
      {disconnected && (
        <div className="fixed h-screen w-screen bg-black/80 flex items-center justify-center">
          <p className="text-4xl text-red-400 animate-pulse capitalize">
            Trying to reconnect
          </p>
        </div>
      )}
      <div className={`min-w-[300px] bg-black flex flex-col fixed left-0 ${drawer ? 'bottom-0':'-bottom-[1300px]'} duration-300 h-screen md:static z-20`}>
       
        <div className="text-3xl text-white font-bold flex items-center justify-center gap-3 mb-6 py-4">
          <ChatBubbleLeftRightIcon className="text-indigo-600 w-7" />
          <h1>
            Alpha Chat <span className="text-indigo-600">.</span>
          </h1>
        </div>
        <h1 className="text-white p-4 text-lg capitalize text-center bg-slate-900 mb-6">
          welcome {user.username}
        </h1>
        <div className="flex-1 overflow-y-scroll myScroll ">
          <h3 className="py-3 text-white uppercase text-sm">online users</h3>
          {Object.keys(peopleOnline)?.map((el) => {
            if (user?.username !== peopleOnline[el])
              return (
                <div       key={el} onClick={()=>{setChosen(el);setDrawer(false)}}> 
                   <Contact
                chosen={chosen}
                el={el}
                online={true}
                setChosen={setChosen}
          
                username={peopleOnline[el]}
              /></div>
              
              );
          })}
        </div>
        <div className="flex-1 overflow-y-scroll myScroll ">
          <h3 className="py-3 text-white uppercase text-sm">offline users</h3>

          {peopleOffline?.map((el) => {
            if (user?.username !== el?.username)
              return (
                <div     key={el?._id} onClick={()=>{setChosen(el._id);setDrawer(false)}}>  
                   <Contact
                chosen={chosen}
                el={el}
                online={false}
                setChosen={setChosen}
                id={el?._id}
            
                username={el?.username}
              /></div>
            
              );
          })}
        </div>

        <button
          onClick={handleLogout}
          className="text-white bg-indigo-600 py-2 w-fit  self-center px-20 m-4 rounded-md duration-300 hover:bg-indigo-900"
        >
          Logout
        </button>
      </div>

      <div className="flex-1 bg-slate-200 pb-5 px-3 flex flex-col ">
        <div className="flex-1 overflow-y-scroll myScroll">
          {chosen && !loading &&
            messages?.map((el, i) => (
              <div
                className={`${
                  el?.sender === user?._id
                    ? "bg-indigo-600 text-white ml-auto"
                    : "bg-white text-gray-600 "
                } m-3 w-fit max-w-[300px] p-2 rounded-lg`}
                key={i}
              >
                {" "}
                <p>{el?.text}</p>
                {el?.file && (
                  <p className="flex items-center gap-1 py-2">
                    {" "}
                    <PaperClipIcon
                      className={`h-4 ${
                        el.sender === user._id ? "text-white" : "text-gray-600"
                      }`}
                    />
                    <a
                      className="underline"
                      href={"https://api-chat-ukxi.onrender.com/api/uploads/" + el?.file}
                      target={"_blank"}
                      rel="noreferrer"
                    >
                      {el?.file}
                    </a>{" "}
                  </p>
                )}
              </div>
            ))}
          {chosen && loading && (
            <p className="w-full h-full flex items-center justify-center text-5xl text-gray-400 animate-pulse">
              Loading...
            </p>
          )}
          {chosen && messages?.length === 0 && !loading && (
            <p className="w-full h-full flex items-center justify-center text-5xl text-gray-400 capitalize ">
              No messages
            </p>
          )}

          {!chosen && (
            <div className="h-full flex items-center justify-center text-slate-400 md:text-5xl text-2xl font-bold">
              &larr;Select a person{" "}
            </div>
          )}

          <div ref={theRef} />
        </div>

        {chosen && (
          <form
            onSubmit={(e) => {
              handleSending(e, file);
            }}
            className="flex gap-2 py-2 relative"
          >
            {file?.data && (
              <div className="absolute px-4 py-1 rounded-full -top-8 right-3 bg-indigo-400 border border-indigo-600 text-white flex items-center gap-2">
                {file?.name}{" "}
                <span
                  className="flex items-center justify-center w-5 h-5 p-2 rounded-full cursor-pointer bg-indigo-600"
                  onClick={() => {
                    setFile(null);
                  }}
                >
                  X
                </span>
              </div>
            )}
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              type="text"
              placeholder="write your message"
              className="flex-1 focus:shadow-md focus:shadow-zinc-500  p-3 rounded-md outline-none  duration-300"
            />
            <input type="file" id="attach" hidden onChange={sendFile} />
            <label
              className="disabled:bg-gray-400 bg-indigo-600 w-12 flex items-center justify-center hover:bg-indigo-700 rounded-md cursor-pointer  duration-300"
              htmlFor="attach"
            >
              <PaperClipIcon className="h-6 text-white" />
            </label>
            <button
              disabled={!newMessage.trim() && !file}
              className="disabled:bg-gray-400 bg-indigo-600 w-12 flex items-center justify-center hover:bg-indigo-700 rounded-md  duration-300"
            >
              <PaperAirplaneIcon className="text-white h-6" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Chat;
