import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "./UserContext.jsx";

const RegisterAndLoginForm = () => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginOrRegister, setIsLoginOrRegister] = useState(false);
  const { setUsername: setLoggedInUsername, setId } = useContext(UserContext);

  useEffect(() => {
    // Check if user is already logged in (persisted in localStorage)
    const storedUsername = localStorage.getItem("username");
    const storedUserId = localStorage.getItem("userId");

    if (storedUsername && storedUserId) {
      setLoggedInUsername(storedUsername);
      setId(storedUserId);
      setIsLoginOrRegister(true);
    }
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
      // console.error(
      //   "Authentication failed:",
      //   error.response?.data || error.message
      // ); // Handle the error, e.g., show a message to the user
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
    <div className="bg-blue-50 h-screen flex items-center">
      <form className="w-64 mx-auto mb-12" onSubmit={handleSubmit}>
        <input
          value={username}
          onChange={(e) => setUserName(e.target.value)}
          type="text"
          placeholder="username"
          className="block w-full rounded-sm p-2 mb-2 border"
          required
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="password"
          className="block w-full rounded-sm p-2 mb-2 border"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white block w-full rounded-sm p-2"
        >
          {isLoginOrRegister ? "Register" : "Login"}
        </button>
        <div className="text-center mt-2">
          {isLoginOrRegister ? (
            <div>
              Already a member?{" "}
              <button onClick={() => setIsLoginOrRegister(false)}>
                Login here
              </button>
            </div>
          ) : (
            <div>
              Don't have an account?{" "}
              <button onClick={() => setIsLoginOrRegister(true)}>
                Register
              </button>
            </div>
          )}
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default RegisterAndLoginForm;
