import React from "react";
import "./App.js";
import "./NavBar.css";

const NavBar = () => {
    return(
        <nav className="nav-bar">
            <div id="logo-container">
                <img id="logo" src="/logo.png" alt="logo"></img>
                <div className="scorelens-name">ScoreLens</div>
            </div>
            <div className="navbar-links">
                <ul>
                    <li><a href="#login">Login</a></li>
                    <li><a href="#features-page">Features</a></li>
                    <li><a href="#analytics-page">Analytics</a></li>
                    <li><a href="#">About</a></li>
                    <li><a href="#">Contact</a></li>
                </ul>
            </div>
        </nav>
    );
};

export default NavBar;