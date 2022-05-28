import React, { useState } from "react";
import "./login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = ({ updateUser }) => {
  const [loginStatus, setLoginStatus] = useState("");
  const navigate = useNavigate();

  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user, // preserving the previous state
      [name]: value,
    });
  };

  const login = () => {
    axios.post("http://127.0.0.1:5000/login", user).then((res) => {
      setLoginStatus(res.data.message);
      // console.log(res);
      updateUser(res.data.user);
      navigate("/homepage");
    });
  };
  return (
    <div className="login-page">
      <div className="login-box">
        <h1>Login</h1>
        <div className="text-boxes col-sm-2">
          <input
            className="form-control"
            type="text"
            placeholder="Enter your Email"
            name="username"
            value={user.username}
            onChange={handleChange}
          />

          <input
            name="password"
            value={user.password}
            onChange={handleChange}
            className="form-control"
            type="password"
            placeholder="Enter your password"
          />
          <span className="lr-status">{loginStatus}</span>
          <br />
          <div className="submit-lr-btn btn btn-primary" onClick={login}>
            Login
          </div>
          <br />
          <a className="lr-anchor-btn" onClick={() => navigate("/register")}>
            New user? Click here to register.
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
