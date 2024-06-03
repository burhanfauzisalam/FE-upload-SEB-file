"use client";
import { useState } from "react";
import "../style/login.css"; // Import the CSS file
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { push } = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (!username && !password) {
      alert("Please fill username and password");
      return;
    }
    try {
      const data = { username, password };
      const res = await axios.post(`/api/login`, data);
      Cookies.set("id", res.data._id, { expires: 7 });
      // console.log(res.data);
      push("/dashboard");
      setLoading(false);
    } catch (error) {
      setError(error.response.data.message);
      setUsername("");
      setPassword("");
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2 className="login-title">Login teacher</h2>
        <div className="form-group">
          <label htmlFor="username" className="form-label">
            Username:
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-input"
          />
        </div>
        {loading
          ? "Loading..."
          : username &&
            password && (
              <button type="submit" className="submit-button">
                Login
              </button>
            )}
        {error && <h5 style={{ color: "red" }}>*{error}</h5>}
      </form>
    </div>
  );
};

export default LoginForm;
