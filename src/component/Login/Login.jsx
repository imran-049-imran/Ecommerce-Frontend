import React, { useContext, useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import loginImage from "../../assets/login.png";
import { login } from "../../service/authService";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";

const Login = () => {
  const {setToken,loadCartData } = useContext(StoreContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const response = await login(formData);

      if (response.status === 200) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);

        toast.success("Login successful!");
       await loadCartData(response.data.token);
        navigate("/");
      } else {
        toast.error("Unable to login. Try again.");
      }
    } catch (error) {
      console.error("Login error: ", error);
      toast.error("Unable to login. Please try again.");
    }
  };

  const handleReset = () => {
    setFormData({
      email: "",
      password: "",
      remember: false,
    });
  };

  return (
    <div
      className="login-wrapper"
      style={{
        backgroundImage: `url(${loginImage})`,
      }}
    >
      <div className="login-card">
        <h5>Sign In</h5>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="checkbox-row">
            <input
              type="checkbox"
              id="remember"
              name="remember"
              checked={formData.remember}
              onChange={handleChange}
            />
            <label htmlFor="remember">Remember me</label>
          </div>

          <button className="btn btn-outline-primary w-100 mb-2" type="submit">
            Sign In
          </button>

          <button
            className="btn btn-outline-danger w-100 mb-3"
            type="button"
            onClick={handleReset}
          >
            Reset
          </button>

          <p className="register-text">
            Don’t have an account?{" "}
            <Link to="/register" className="register-link">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;