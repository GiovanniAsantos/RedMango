import React, { useState } from "react";
import { inputHelper } from "../Helper";
import { useLoginUserMutation } from "../apis/authApi";
import { apiResponse, userModel } from "../Interfaces";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLoggedInUser } from "../Storage/Redux/userAuthSlice";
import { MainLoader } from "../Components/Page/Common";

function Login() {
  const navigate = useNavigate();
  const [loginUser] = useLoginUserMutation();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [userInput, setUserInput] = useState({
    username: "",
    password: "",
  });

  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tempData = inputHelper(e, userInput);
    setUserInput(tempData);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const response: apiResponse = await loginUser({
      username: userInput.username,
      password: userInput.password,
    });

    if (response.data) {
      const { token } = response.data.result;
      const { fullName, id, email, role }: userModel = jwtDecode(token);
      localStorage.setItem("token", token);
      dispatch(setLoggedInUser({ fullName, id, email, role }));
      navigate("/");
    }

    setLoading(false);
  };
  return (
    <div className="container text-center">
      {loading && <MainLoader />}
      <form method="post" onSubmit={handleSubmit}>
        <h1 className="mt-5">Login</h1>
        <div className="mt-5">
          <div className="col-sm-6 offset-sm-3 col-xs-12 mt-4">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Username"
              name="username"
              value={userInput.username}
              onChange={handleUserInput}
              required
            />
          </div>

          <div className="col-sm-6 offset-sm-3 col-xs-12 mt-4">
            <input
              type="password"
              className="form-control"
              placeholder="Enter Password"
              name="password"
              value={userInput.password}
              onChange={handleUserInput}
              required
            />
          </div>
        </div>

        <div className="mt-2">
          <button
            type="submit"
            className="btn btn-success"
            style={{ width: "200px" }}
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
