import React from "react";
import { Route, Routes, Link } from "react-router-dom";
import "./App.css";

// COMPONENT IMPORTS
import { Home } from "./pages/home/Home";
import { BarChart } from "./pages/bar-chart/BarChart";

function App() {
    return (
        <div className="App">
            <nav className="navbar">
                <Link to="/" className="navlink">
                    home
                </Link>
                /
                <Link to="/bar-chart" className="navlink">
                    bar-chart
                </Link>
            </nav>
            <Routes>
                <Route
                    path="/data-driven-documents/#"
                    element={<Home />}
                ></Route>
                <Route
                    path="/data-driven-documents/bar-chart"
                    element={<BarChart />}
                ></Route>
            </Routes>
        </div>
    );
}

export default App;
