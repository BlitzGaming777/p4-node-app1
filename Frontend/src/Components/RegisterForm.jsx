import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisterForm.css";

const RegisterForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous error messages
    setError("");

    // Perform form validation
    if (!name) {
      setError("Please enter your name.");
      return;
    }

    if (!email) {
      setError("Please enter your email address.");
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Invalid email address format.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    } else if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    // If all fields are filled, proceed with API call for user registration
    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Registration successful
        alert("Registration successful. You can now log in.");
        navigate("/main"); 
      } else {
        // Registration failed, display error message
        setError(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred. Please try again later.");
    }
  };

  console.log("Rendering RegisterForm component");

  return (
    <div>
      <div className="register-modal-container">
        <div className="register-form-container">
          <form className="register-form" onSubmit={handleSubmit}>
            <h2>Register</h2>
            {error && <p className="error-message">{error}</p>}
            <div>
              <input
                className="name-input"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <br />
            <div>
              <input
                className="email-input"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <br />
            <div>
              <input
                className="password-input"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <br />
            <button type="submit">Register</button>
            <br />
            <p>Already have an account? Click on the Log In button.</p>
            <button type="button" onClick={() => navigate("/")}>
              Log In
            </button>
            <br />
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
