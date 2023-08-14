import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook
import "./LoginForm.css";

const LoginForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Login clicked"); 
    // Clear previous error messages
    setError("");

    // Perform form validation
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    console.log("Sending request with:", email, password); 
    // Perform API call for login
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Login Successful");

        // Navigate to the main "Recipe Finder" page
        navigate("/main");
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred. Please try again later.");
    }
  };

  return (
    <>
      <div className="login-modal-container">
        <div className="login-form-container">
          <form className="login-form" onSubmit={handleLogin}>
            <h2>Login</h2>
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
            <br/>
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
            <button type="submit">Log In</button>
            <br />
            <p>Don't have an account? Click on the Register button.</p>
            <button type="button" onClick={() => navigate("/register")}>
              Register
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
