import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "./authSlice";
import { useSignupMutation } from "./authApiSlice";
import { PulseLoader } from "react-spinners";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [signup, { isLoading }] = useSignupMutation();

  useEffect(() => {
    setErrMsg("");
  }, [username, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { accessToken } = await signup({
        username,
        email,
        password,
      }).unwrap();
      dispatch(setCredentials({ accessToken }));
      setUsername("");
      setEmail("");
      setPassword("");
      navigate("/login");
    } catch (err) {
      if (!err.status) {
        setErrMsg("No server Response");
      } else if (err.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg(err.data?.message);
      }
    }
  };

  const handleUserInput = (e) => setUsername(e.target.value);
  const onEmailChanged = (e) => setEmail(e.target.value);
  const handlePwdInput = (e) => setPassword(e.target.value);

  const errClass = errMsg ? "errMsg" : "offscreen";

  if (isLoading)
    return (
      <div className="loader-container">
        <PulseLoader color={"#000"} className="pulse-loader" />
      </div>
    );

  const content = (
    <section
      id="signup__form"
      className="auth"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div>
        <p className={errClass} aria-live="assertive">
          {errMsg}
        </p>
        <form id="auth_form" onSubmit={handleSubmit}>
          <div id="auth_header">
            <h1>Sign up</h1>
          </div>
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            name="username"
            type="text"
            value={username}
            onChange={handleUserInput}
            autoComplete="off"
            required
          />

          <label htmlFor="email">Email:</label>
          <input
            className={`form__input`}
            id="email"
            name="email"
            type="email"
            autoComplete="off"
            value={email}
            onChange={onEmailChanged}
          />

          <label htmlFor="password">Password:</label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={handlePwdInput}
            required
          />

          <button id="auth__btn" className="btn">
            Sign Up
          </button>

          <div className="auth__container">
            Already have an account?
            <Link to="/login"> Login</Link>
          </div>

          <div className="home-link__container">
            <Link to="/">Back to Home</Link>
          </div>
        </form>
      </div>
      <footer>
        <div className="about-footer">
          <h4>About Migrant flow</h4>
          <h6>About us</h6>
          <h6>Our mission</h6>
        </div>
        <div className="contact-footer">
          <h4>Contact us</h4>
          <h6>Advertise</h6>
          <h6>Whatsapp</h6>
          <h6>Email</h6>
        </div>
      </footer>
    </section>
  );

  return content;
};

export default Signup;
