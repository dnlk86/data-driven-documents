import React from "react";
import { Route, Routes, Link } from "react-router-dom";
import "./App.css";

// COMPONENT IMPORTS
import { Home } from "./pages/home/Home";
import { BarChart } from "./pages/bar-chart/BarChart";
import { ScatterplotGraph } from "./pages/scatterplot-graph/ScatterplotGraph";
import { HeatMap } from "./pages/heat-map/HeatMap";
import { ChoroplethMap } from "./pages/choropleth-map/ChoroplethMap";
import { TreeMapDiagram } from "./pages/treemap-diagram/TreeMapDiagram";

function App() {
    return (
        <div className="App">
            <nav className="navbar">
                <Link to="" className="navlink">
                    home
                </Link>
                /
                <Link to="/bar-chart" className="navlink">
                    bar-chart
                </Link>
                /
                <Link to="/scatterplot-graph" className="navlink">
                    scatterplot-graph
                </Link>
                /
                <Link to="/heat-map" className="navlink">
                    heat-map
                </Link>
                /
                <Link to="/choropleth-map" className="navlink">
                    choropleth-map
                </Link>
                /
                <Link to="/treemap-diagram" className="navlink">
                    treemap-diagram
                </Link>
            </nav>
            <Routes>
                <Route exact path="" element={<Home />}></Route>
                <Route path="/bar-chart" element={<BarChart />}></Route>
                <Route
                    path="/scatterplot-graph"
                    element={<ScatterplotGraph />}
                ></Route>
                <Route path="/heat-map" element={<HeatMap />}></Route>
                <Route
                    path="/choropleth-map"
                    element={<ChoroplethMap />}
                ></Route>
                <Route
                    path="/treemap-diagram"
                    element={<TreeMapDiagram />}
                ></Route>
            </Routes>
        </div>
    );
}

export default App;
