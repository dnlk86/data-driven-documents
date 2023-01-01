import React, { useEffect, useRef } from "react";
import styles from "./TreeMapDiagram.module.css";
import * as d3 from "d3";

export function TreeMapDiagram() {
    const ref = useRef();

    useEffect(() => {
        const svg = d3.select(ref.current);

        const h = window.innerHeight * 0.8;
        const w = window.innerWidth * 0.9;
        const padding = 100;

        svg.style("background-color", "var(--color-1)")
            .style("height", `${h}px`)
            .style("width", `${w}px`);

        const loadData = async () => {
            const videogameUrl =
                "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json";
            const kickstarterUrl =
                "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json";
            const movieUrl =
                "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json";
            const responses = await Promise.all([
                fetch(videogameUrl),
                fetch(kickstarterUrl),
                fetch(movieUrl),
            ]);
            const videogameData = await responses[0].json();
            const kickstarterData = await responses[1].json();
            const movieData = await responses[2].json();
            return [videogameData, kickstarterData, movieData];
        };

        loadData().then((result) => {
            const videogameData = result[0];
            const kickstarterData = result[1];
            const movieData = result[1];

            // console.log(videogameData);
            // console.log(kickstarterData);
            // console.log(movieData);

            const tooltip = d3.select("#tooltip");

            // choropleth-title
            svg.select("#title")
                .append("text")
                .text("Video Game Sales")
                .attr("text-anchor", "middle")
                .attr("x", w / 2)
                .attr("y", 30)
                .attr("fill", "var(--color-5)")
                .style("font-size", "1.5rem")
                .style("text-decoration", "underline");

            // choropleth-description
            svg.select("#description")
                .append("text")
                .text("Top 100 Most Sold Video Games Grouped by Platform")
                .attr("text-anchor", "middle")
                .attr("x", w / 2)
                .attr("y", 60)
                .attr("fill", "var(--color-5)")
                .style("font-size", "1.0rem")
                .style("text-decoration", "underline");

            const root = d3
                .hierarchy(videogameData)
                .sum((d) => d.value)
                .sort((a, b) => b.value - a.value);

            const treemapRoot = d3.treemap().size([w, h]).padding(1)(root);

            const nodes = svg
                .selectAll("g")
                .data(treemapRoot.leaves())
                .join("g")
                .attr("transform", (d) => `translate(${d.x0},${d.y0})`);

            const fader = (color) => d3.interpolateRgb(color, "#fff")(0.3);
            const colorScale = d3.scaleOrdinal(d3.schemeCategory10.map(fader));

            nodes
                .append("rect")
                .attr("width", (d) => d.x1 - d.x0)
                .attr("height", (d) => d.y1 - d.y0)
                .attr("fill", (d) => colorScale(d.category));
        });
    }, [ref]);

    return (
        <div className={styles.treeMap}>
            <h2 id="page-title">d3 treemap diagram example</h2>
            <svg ref={ref}>
                <g id="title"></g>
                <g id="description"></g>
                <g id="map-container">
                    <g id="map" />
                </g>
                <g id="legend">
                    <g id="legend-scale" />
                </g>
            </svg>
            <div
                id="tooltip"
                style={{
                    position: "absolute",
                    bottom: "",
                    left: "",
                    padding: "10px",
                    textAlign: "left",
                    width: "max-content",
                    height: "max-content",
                    backgroundColor: "greenyellow",
                    borderRadius: "10px",
                    opacity: "0",
                    color: "var(--color-5)",
                    fontSize: "0.75rem",
                    fontWeight: "bold",
                    pointerEvents: "none",
                    zIndex: "9999999",
                }}
            ></div>
        </div>
    );
}
