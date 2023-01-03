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
            // const kickstarterData = result[1];
            // const movieData = result[1];

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

            const map = svg
                .select("#map")
                .attr("transform", `translate(${padding}, ${padding})`);

            const root = d3
                .hierarchy(videogameData)
                .sum((d) => parseFloat(d.value))
                .sort((a, b) => parseFloat(b.value) - parseFloat(a.value));

            const treemapRoot = d3
                .treemap()
                .size([w - 2 * padding, h - 2 * padding])
                .padding(1)(root);

            const nodes = map
                .selectAll("g")
                .data(treemapRoot.leaves())
                .join("g")
                .attr("transform", (d) => `translate(${d.x0},${d.y0})`);

            const fader = (color) => d3.interpolateRgb(color, "#fff")(0.25);
            const colorScale = d3.scaleOrdinal(d3.schemeCategory10.map(fader));

            nodes
                .append("rect")
                .attr("class", "tile")
                .attr("data-name", (d) => d.data.name)
                .attr("data-category", (d) => d.data.category)
                .attr("data-value", (d) => d.data.value)
                .attr("width", (d) => d.x1 - d.x0)
                .attr("height", (d) => d.y1 - d.y0)
                .attr("fill", (d) => colorScale(d.data.category));

            nodes
                .append("text")
                .text((d) => d.data.value)
                .attr("font-size", `10px`)
                .attr("x", 5)
                .attr("y", 15)
                .style("pointer-events", "none");

            nodes
                .on("mouseover", (e, v) => {
                    tooltip.transition().duration(100).style("opacity", 0.9);
                    tooltip
                        .html(
                            `Platform: ${v.data.category}<br />Title: ${v.data.name}<br />Value: ${v.data.value} Million`
                        )
                        .attr("data-value", v.data.value)
                        .style("left", `${e.clientX}px`)
                        .style("bottom", `${h * 1.3 - e.clientY}px`);
                    d3.select(e.currentTarget)
                        .style("fill", "greenyellow")
                        .style("cursor", "pointer");
                })
                .on("mouseout", (e, v) => {
                    tooltip.transition().duration(100).style("opacity", 0);
                    tooltip.html("");
                    d3.select(e.currentTarget).style("fill", "black");
                });

            const categories = treemapRoot.data.children;

            const legendScale = d3
                .scaleBand()
                .domain(categories.map((child) => child.name).reverse())
                .range([h - padding, padding]);

            const legend = d3.axisRight(legendScale);
            svg.select("#legend-scale")
                .attr("transform", "translate(" + (w - 80) + ", 0)")
                .style("color", "var(--color-5)")
                .style("font-size", "0.75rem")
                .style("font-weight", "bold")
                .call(legend);

            const legendRectHeight = (h - 2 * padding) / categories.length;

            d3.select("#legend")
                .selectAll("rect")
                .data(categories)
                .enter()
                .append("rect")
                .attr("class", "legend-item")
                .attr("x", w - 90 + "px")
                .attr("y", (d, i) => padding + i * legendRectHeight)
                .attr("width", 10)
                .attr("height", legendRectHeight)
                .attr("fill", (d) => colorScale(d.name))
                .attr("stroke", "grey")
                .style("stroke-width", "0.5px");
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
