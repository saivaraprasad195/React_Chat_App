import React, { useRef, useState } from "react";
import "./login.css";
import { toast } from "react-toastify";
import { auth, db } from "../../lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import upload from "../../lib/upload";
import useUserStore from "../../lib/userStore";

const Login = () => {
  const { fetchUserInfo } = useUserStore();
  const [login, setLogin] = useState(true);
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });
  const formRef = useRef(null);

  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formdata = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(formdata);

    // Inputs Validation
    if (!username || !email || !password) {
      return toast.warn("Please enter all inputs!");
    }
    if (!avatar.file) return toast.warn("Please upload an avatar!");

    //UNIQUE username validation
    const userRef = collection(db, "users");
    const username_query = query(userRef, where("username", "==", username));
    const querySnapShot_username = await getDocs(username_query);
    if (!querySnapShot_username.empty) {
      setLoading(false);
      return toast.warn("Username already exists!");
    }

    //UNIQUE email validation
    const email_query = query(userRef, where("email", "==", email));
    const querySnapShot_email = await getDocs(email_query);
    if (!querySnapShot_email.empty) {
      setLoading(false);
      return toast.warn("Email already exists!");
    }
    try {
      //creating user with email and password
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const imgURL = await upload(avatar.file);

      //Creating new user in user DB
      await setDoc(doc(db, "users", res.user.uid), {
        username,
        email,
        avatar: imgURL,
        id: res.user.uid,
        blocked: [],
      });

      //creating userChats in DB
      await setDoc(doc(db, "userchats", res.user.uid), {
        chats: [],
      });
      toast.success("Account Created");
      formRef.current.reset();
      setLogin(true);

      {
        /* Directly show chatList after CreatingUser*/
        // fetchUserInfo(res.user.uid);
        // await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formdata = new FormData(e.target);
    const { email, password } = Object.fromEntries(formdata);
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      //Manually fetch user info after login
      fetchUserInfo(res.user.uid);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  function handleAvatar(e) {
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
        <form onSubmit={handleLogin}>
          <input type="text" placeholder="Email" name="email" id="email" />
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
          />
          <button disabled={loading}>Login</button>
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
        <form onSubmit={handleRegister} ref={formRef}>
          <input
            type="text"
            placeholder="Username"
            name="username"
            id="username"
          />
          <input type="text" placeholder="Email" name="email" />
          <input type="password" name="password" placeholder="Password" />
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
          <button disabled={loading}>Sign Up</button>
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
