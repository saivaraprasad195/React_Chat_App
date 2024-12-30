import React, { useState } from "react";
import "./login.css";

const Login = () => {
  const [login, setLogin] = useState(true);
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });

  function handleAvatar(e) {
    console.log(e);
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        name: e.target.files[0].name,
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  }

  return login ? (
    <div className="login">
      <div className="item">
        <h2>Welcome back</h2>
        <form>
          <input type="text" placeholder="Email" name="email" id="email" />
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
          />
          <button>Login</button>
          <p>
            Don't have an Account?{" "}
            <a
              href="#"
              style={{ color: "orange" }}
              onClick={() => setLogin((prev) => !prev)}
            >
              {" "}
              Sign Up
            </a>
          </p>
        </form>
      </div>
    </div>
  ) : (
    <div className="signUp">
      <div className="item">
        <h2>Create an Account</h2>
        <form>
          <input
            type="text"
            placeholder="Username"
            name="username"
            id="username"
          />
          <input type="text" placeholder="Email" name="email" id="email" />
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
          />
          <label htmlFor="file">
            <img
              src={avatar.url || "/avatar.png"}
              alt=""
              className="uploadedImage"
            />
            {avatar.name ? avatar.name : "Upload an Image"}
          </label>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleAvatar}
          />
          <button>Sign Up</button>
          <p>
            Already have an Account?{" "}
            <a
              href="#"
              style={{ color: "orange" }}
              onClick={() => setLogin((prev) => !prev)}
            >
              {" "}
              Login
            </a>
            </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
