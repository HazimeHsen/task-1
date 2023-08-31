import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home/Home";
import User from "./components/Users/User";
import Tags from "./components/Tags/Tags";
import Posts from "./components/Posts/Posts";
import Nav from "./components/Navbar/Nav";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div>
          <ToastContainer position="bottom-center" limit={1} />

          <div className="full-height">
            <Nav />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/users" element={<User />} />
              <Route path="/tags" element={<Tags />} />
              <Route path="/posts" element={<Posts />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
