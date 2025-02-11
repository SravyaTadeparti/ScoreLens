import React from "react";
import "./App.js";
import "./NavBar.css";

const NavBar = () => {
    return(
        <nav className="nav-bar">
            <div id="logo-container">
                <img id="logo" src="/logo.png" alt="logo"></img>
            </div>
            <div className="navbar-links">
                <ul>
                    <li><a href="#">Home</a></li>
                    <li><a href="#">About</a></li>
                    <li><a href="#">Services</a></li>
                    <li><a href="#">Contact</a></li>
                </ul>
            </div>
        </nav>
    );
};

export default NavBar;