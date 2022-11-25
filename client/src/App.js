import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NavBar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import About from "./pages/about";
import Profile from "./pages/profile";
import Home from "./pages/home";
import SpotifyLogin from './SpotifyLogin'
import SignUpPage from './SignUpPage'
import { UserContext } from './contexts/googleuser.context'
import { useContext } from 'react';


const code = new URLSearchParams(window.location.search).get("code");

function App(){

const { currentUser } = useContext(UserContext);
//console.log(code);


  return (<Routes>
      <Route path='/' element={<NavBar />}>
        <Route path="/" element={<Home />}></Route>
        <Route path="/about" element={<About />}></Route>
        {code ? (<Route path="/profile" element={<Dashboard code={code} />}></Route>) : (<Route path="/profile" element={<SpotifyLogin />}></Route>)}
        <Route path="/login" element={<SignUpPage />}></Route>
      </Route>
    </Routes>)

  }

export default App;


  
// return (currentUser ? ( <Routes>
//   <Route path='/' element={<NavBar code={code} />}>
//     <Route path="/" element={<Home />}></Route>
//     <Route path="/about" element={<About />}></Route>
//     <Route path="/profile" element={<Profile code={code} />}></Route>
//     <Route path="/login" element={<SignUpPage />}></Route>
//   </Route>
// </Routes>) : (<SignUpPage />)
// )


/*
function App() {
  return code ? 
    <>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </Router>
      <Dashboard code={code} /> 
    </>
      : <Login />;
}
*/