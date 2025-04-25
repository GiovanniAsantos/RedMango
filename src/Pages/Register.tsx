import React, { useState } from "react";
import { SD_Roles } from "../Utility/SD";
import { inputHelper, toastNotify } from "../Helper";
import { useRegisterUserMutation } from "../apis/authApi";
import { apiResponse } from "../Interfaces";
import { MainLoader } from "../Components/Page/Common";
import { useNavigate } from "react-router-dom";

function Register() {
  const [registerUser] = useRegisterUserMutation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState({
    username: "",
    password: "",
    role: "",
    name: "",
  });

  const handleUserInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const tempData = inputHelper(e, userInput);
    setUserInput(tempData);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const response: apiResponse = await registerUser({
      username: userInput.username,
      password: userInput.password,
      role: userInput.role,
      name: userInput.name,
    });

    if (response.data) {
      toastNotify("Registration successful! Please Login to continue");
      navigate("/login");
    }

    setLoading(false);
  };

  return (
    <div className="container text-center">
      {loading && <MainLoader />}
      <form method="post" onSubmit={handleSubmit}>
        <h1 className="mt-5">Register</h1>
        <div className="mt-5">
          <div className="col-sm-6 offset-sm-3 col-xs-12 mt-4">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Username"
              name="username"
              required
              value={userInput.username}
              onChange={handleUserInput}
            />
          </div>
          <div className="col-sm-6 offset-sm-3 col-xs-12 mt-4">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Name"
              name="name"
              required
              value={userInput.name}
              onChange={handleUserInput}
            />
          </div>
          <div className="col-sm-6 offset-sm-3 col-xs-12 mt-4">
            <input
              type="password"
              className="form-control"
              placeholder="Enter Password"
              name="password"
              required
              value={userInput.password}
              onChange={handleUserInput}
            />
          </div>
          <div className="col-sm-6 offset-sm-3 col-xs-12 mt-4">
            <select
              className="form-control form-select"
              required
              name="role"
              value={userInput.role}
              onChange={handleUserInput}
            >
              <option value="">--Select Role--</option>
              <option value={`${SD_Roles.COSTUMER}`}>Customer</option>
              <option value={`${SD_Roles.ADMIN}`}>Admin</option>
            </select>
          </div>
        </div>
        <div className="mt-5">
          <button type="submit" className="btn btn-success" disabled={loading}>
            Register
          </button>
        </div>
      </form>
    </div>
  );
}

export default Register;
