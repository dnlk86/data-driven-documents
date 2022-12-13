import React from "react";
import { Route, Routes, Link } from "react-router-dom";
import "./App.css";

// COMPONENT IMPORTS
import { Home } from "./pages/home/Home";

function App() {
    return (
        <div className="App">
            <nav className="navbar">
                <Link to="/" className="navlink">
                    #
                </Link>
            </nav>
            <Routes>
                <Route path="/" element={<Home />}></Route>
            </Routes>
        </div>
    );
}

export default App;
