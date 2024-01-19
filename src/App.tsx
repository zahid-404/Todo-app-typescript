import { useState, useEffect } from "react";
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

  const [showModal, setShowModal] = useState(false);
  const [isBackendRunning, setIsBackendRunning] = useState(false);

  const checkBackend = async () => {
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
      setIsBackendRunning(true);
    } catch (e) {
      navigate("/login");
      setIsBackendRunning(false);
    } finally {
      setShowModal(true);
    }
  };

  useEffect(() => {
    const hasCheckedBackend = localStorage.getItem("hasCheckedBackend");
    if (!hasCheckedBackend) {
      checkBackend();
      localStorage.setItem("hasCheckedBackend", "true");
    } else {
      setIsBackendRunning(true); // Assume backend is running to avoid showing modal on subsequent renders
      checkBackend();
    }
  }, []);

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h1>
              {isBackendRunning
                ? "🚀 The backend is running!"
                : "😟 The backend is not running. Please check the URL."}
            </h1>
            {isBackendRunning ? (
              <>
                <p>Your backend is up and running smoothly. ✅</p>
              </>
            ) : (
              <p>Make sure the backend server is running</p>
            )}
            <a
              href={BASE_URL}
              target="_blank"
              className="button"
              onClick={closeModal}
            >
              Go to Backend
            </a>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
