import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "./UserContext.jsx";
import { quotes } from "./quotes.js";

const RegisterAndLoginForm = () => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginOrRegister, setIsLoginOrRegister] = useState(false);
  const { setUsername: setLoggedInUsername, setId } = useContext(UserContext);
  const [randomQuote, setRandomQuote] = useState("");

  useEffect(() => {
    // Check if user is already logged in (persisted in localStorage)
    const storedUsername = localStorage.getItem("username");
    const storedUserId = localStorage.getItem("userId");

    if (storedUsername && storedUserId) {
      setLoggedInUsername(storedUsername);
      setId(storedUserId);
      setIsLoginOrRegister(true);
    }

    // Select a random quote
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setRandomQuote(quotes[randomIndex]);
  }, [setLoggedInUsername, setId]);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const url = isLoginOrRegister ? "register" : "login";
      const { data } = await axios.post(url, { username, password });

      // Store user info in localStorage
      localStorage.setItem("username", username);
      localStorage.setItem("userId", data.id);

      setLoggedInUsername(username);
      setId(data.id);
      setIsLoginOrRegister(true);
    } catch (error) {
      if (error.response.status === 409) {
        toast.error("User already exists", {
          position: "bottom-right",
        });
      } else if (error.response && error.response.status === 401) {
        toast.error("Wrong credentials", {
          position: "bottom-right",
        });
      } else {
        toast.error("Registration failed, please try again later", {
          position: "bottom-right",
        });
      }
    }
  }

  return (
    <div className="bg-blue-50 h-screen flex items-center justify-center">
      <div className="w-full max-w-lg flex rounded-lg overflow-hidden bg-white shadow-lg">
      <div className="flex-1 bg-gray-100 p-8 flex items-center justify-center">
          <div className="text-center text-gray-600 italic">"{randomQuote}"</div>
        </div>
        <div className="flex-1 p-8">
          <form onSubmit={handleSubmit}>
            <input
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              type="text"
              placeholder="Username"
              className="block w-full rounded-sm p-2 mb-2 border"
              required
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              className="block w-full rounded-sm p-2 mb-2 border"
              required
            />
            <button
              type="submit"
              className="bg-blue-500 text-white block w-full rounded-sm p-2 mb-4"
            >
              {isLoginOrRegister ? "Register" : "Login"}
            </button>
            <div className="text-center">
              {isLoginOrRegister ? (
                <div>
                  Already a member?{" "}
                  <button
                    onClick={() => setIsLoginOrRegister(false)}
                    className="text-blue-500"
                  >
                    Login here
                  </button>
                </div>
              ) : (
                <div>
                  Don't have an account?{" "}
                  <button
                    onClick={() => setIsLoginOrRegister(true)}
                    className="text-blue-500"
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default RegisterAndLoginForm;
