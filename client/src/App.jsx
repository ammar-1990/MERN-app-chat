import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Chat from "./pages/Chat";


const router = createBrowserRouter([

{
  path:'/',
  element:<Chat />
},

{
  path:'/register',
  element:<Register />
},
{
  path:'/login',
  element:<Login />
},
{
  path:'/chat',
  element:<Chat />
},



]

)


function App() {







  return <RouterProvider router={router} />;
}

export default App;
