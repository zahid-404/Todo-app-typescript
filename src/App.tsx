import { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { RecoilRoot } from "recoil";
import Login from "./Components/Login.jsx";
import Signup from "./Components/Signup.jsx";
import TodoList from "./Components/TodoList.jsx";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { authState } from "./store/authState.js";

function App() {
  return (
    <RecoilRoot>
      <Router>
        <InitState />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/todos" element={<TodoList />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </Router>
    </RecoilRoot>
  );
}

function InitState() {
  const setAuth = useSetRecoilState(authState);
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const init = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(BASE_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.username) {
        setAuth({ token: data.token, username: data.username });
        navigate("/todos");
      } else {
        navigate("/login");
      }
    } catch (e) {
      navigate("/login");
    }
  };
  useEffect(() => {
    init();
  }, []);
  return <></>;
}

export default App;
