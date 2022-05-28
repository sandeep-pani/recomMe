import React, { useState } from "react";
import "./register.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [registrationStatus, setRegistrationStatus] = useState("");
  const [user, setUser] = useState({
    name: "",
    username: "",
    password: "",
    reEnterPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user, // preserving the previous state
      [name]: value,
    });
  };

  const register = async (e) => {
    var { name, username, password, reEnterPassword } = user;
    if(username){
      username = username.trim();
      user.username = username.toLowerCase();      
    }
    if (name && username && username.indexOf(' ') < 1 && password && password === reEnterPassword) {
      var button = document.getElementById(e.target.register_btn)
      button.disabled = true
      axios.post("https://recomme-api.herokuapp.com/register", user).then((res) => {
        setRegistrationStatus(res.data.message);
        if (res.data.message == "success") {
          alert("Successfully Registered");
          navigate("/login");
        }
      });
    } else {
      setRegistrationStatus("Invalid Input");
    }
  };
  return (
    <div className="register-page">
      {/* {console.log(user)} */}
      <div className="register-box">
        <h1>Register</h1>
        <form className="text-boxes col-sm-2">
          <input
            name="name"
            value={user.name}
            onChange={handleChange}
            className="form-control"
            type="text"
            placeholder="Enter your Name"
          />
          <input
            name="username"
            value={user.username}
            onChange={handleChange}
            className="form-control"
            type="text"
            placeholder="Enter your username"
          />

          <input
            name="password"
            value={user.password}
            onChange={handleChange}
            className="form-control"
            type="password"
            placeholder="Enter your password"
          />
          <input
            name="reEnterPassword"
            value={user.reEnterPassword}
            onChange={handleChange}
            className="form-control"
            type="password"
            placeholder="Confirm your password"
          />
          <span className="lr-status">{registrationStatus}</span>
          <br />
          <div id = "register_btn" className="submit-lr-btn btn btn-primary" onClick={register} disabled={false}>
            Register
          </div>
        </form>
        <a
          className="lr-anchor-btn"
          onClick={() => {
            navigate("/login");
          }}
        >
          Already registered? Click here to login.
        </a>
      </div>
    </div>
  );
};

export default Register;
