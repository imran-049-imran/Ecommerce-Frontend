import React, { useState } from "react";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import loginImage from "@/assets/login.png";
import { toast } from "react-toastify";
import { registerUser } from "@/Service/authService";

const Register = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    terms: false,
  });

  const OnChangeHandler = (event) => {
    const { name, type, checked, value } = event.target;
    setData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      const response = await registerUser(data);

      if (response.status === 201) {
        toast.success("Registration completed. Please login.");
        navigate("/login");
      } else {
        toast.error("Unable to register. Please try again.");
      }
    } catch (error) {
      console.error("Register error:", error);
      toast.error("Unable to register. Please try again.");
    }
  };

  const handleReset = () => {
    setData({
      name: "",
      email: "",
      password: "",
      terms: false,
    });
  };

  return (
    <div
      className="register-wrapper"
      style={{ backgroundImage: `url(${loginImage})` }}
    >
      <div className="register-card">
        <h5>Sign Up</h5>

        <form onSubmit={onSubmitHandler}>
          <div className="input-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              required
              value={data.name}
              onChange={OnChangeHandler}
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              required
              value={data.email}
              onChange={OnChangeHandler}
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              required
              value={data.password}
              onChange={OnChangeHandler}
            />
          </div>

          <div className="checkbox-row">
            <input
              type="checkbox"
              id="terms"
              name="terms"
              checked={data.terms}
              onChange={OnChangeHandler}
              required
            />
            <label htmlFor="terms">I agree to Terms & Conditions</label>
          </div>

          <button className="btn btn-outline-success w-100 mb-2" type="submit">
            Sign Up
          </button>

          <button
            className="btn btn-outline-danger w-100 mb-3"
            type="button"
            onClick={handleReset}
          >
            Reset
          </button>

          <p className="register-text">
            Already have an account?{" "}
            <Link to="/login" className="register-link">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
