import React from "react";
import "./styles.css"; // Keep your CSS file

const Login = () => {
    return (
        <div className="login-container">
            <h2>Login</h2>
            <form action="/dashboard.html" method="POST"> {/* Redirect after login */}
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" required />

                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" required />

                <div className="options">
                    <label><input type="checkbox" /> Remember Me</label>
                    <a href="#">Forgot Password?</a>
                </div>

                <button type="submit">Login</button>
                <p>Don't have an account? <a href="/Signup.html">Sign Up</a></p>
            </form>
        </div>
    );
};

export default Login;
