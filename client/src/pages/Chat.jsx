import { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid";
import Avatar from "../components/Avatar";
import { newAxios } from "../util/newAxios";

const Chat = () => {
  const { user } = useAuth();

  const [ws, setWs] = useState(null);
  const [peopleOnline, setPeopleOnline] = useState({});
  const [chosen, setChosen] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const theRef = useRef();
  const [disconnected, setDisconnected] = useState(false);

  const handleSending = (e) => {
    e.preventDefault();

    ws.send(
      JSON.stringify({
        reciever: chosen,
        text: newMessage,
      })
    );
    setMessages((prev) => [
      ...prev,
      { text: newMessage, sender: user._id, reciever: chosen },
    ]);

    setNewMessage("");
  };

  useEffect(() => {
    connectToWS();
  }, []);

  function connectToWS() {
    console.log("ws connected");
    const ws = new WebSocket("ws://localhost:8800");
    setWs(ws);
    setDisconnected(false);
    ws.addEventListener("message", handleMessage);
    ws.addEventListener("close", async () => {
      setDisconnected(true);
      await new Promise((res) =>
        setTimeout(() => {
          res();
        }, 2000)
      );
      connectToWS();
    });
  }

  useEffect(() => {
    theRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (chosen) {
      newAxios(`messages/${chosen}`).then((res) => setMessages(res.data));
    }
  }, [chosen]);

  function handleMessage(e) {
    const data = JSON.parse(e.data);
    if ("online" in data) {
      let people = {};
      data.online.forEach(({ userId, username }) => {
        people[userId] = username;
      });
      setPeopleOnline(people);
    } else {
      setMessages((prev) => [...prev, { ...data }]);
    }
  }

  return (
    <div className="h-screen flex">
         {disconnected && (
          <div className="fixed h-screen w-screen bg-black/80 flex items-center justify-center">
            <p className="text-4xl text-red-400 animate-pulse capitalize">
              Trying to reconnect
            </p>
          </div>
        )}
      <div className="min-w-[300px] bg-black">
        <div className="text-3xl text-white font-bold flex items-center justify-center gap-3 mb-12 py-4">
          <ChatBubbleLeftRightIcon className="text-indigo-600 w-7" />
          <h1>
            Alpha Chat <span className="text-indigo-600">.</span>
          </h1>
        </div>

        <div className=" ">
          {Object.keys(peopleOnline).map((el) => {
            if (user?.username !== peopleOnline[el])
              return (
                <div
                  onClick={() => setChosen(el)}
                  key={el}
                  className={`text-white p-3 capitalize  flex items-center gap-3 cursor-pointer ${
                    chosen !== el && "hover:bg-slate-900"
                  } duration-300 ${chosen === el && "bg-indigo-600"}`}
                >
                  <Avatar username={peopleOnline[el]} userId={el} online={true} />
                  <p>{peopleOnline[el]}</p>
                </div>
              );
          })}
        </div>
      </div>

      <div className="flex-1 bg-slate-200 pb-5 px-3 flex flex-col">
       
        <div className="flex-1 overflow-y-scroll myScroll">
          {chosen &&
            messages.map((el, i) => (
              <p
                className={`${
                  el.sender === user._id
                    ? "bg-blue-500 text-white ml-auto"
                    : "bg-white text-gray-600 "
                } m-3 w-fit max-w-[300px] p-2 rounded-lg`}
                key={i}
              >
                {el.text}
              </p>
            ))}

          {!chosen && (
            <div className="h-full flex items-center justify-center text-slate-400 text-5xl font-bold">
              &larr;Select a person{" "}
            </div>
          )}

          <div ref={theRef} />
        </div>

        {chosen && (
          <form onSubmit={handleSending} className="flex gap-2 py-2">
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              type="text"
              placeholder="write your message"
              className="flex-1 focus:shadow-md focus:shadow-zinc-500  p-3 rounded-md outline-none  duration-300"
            />
            <button
              disabled={!newMessage.trim()}
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
