import React, { useEffect, useRef } from "react";
import styles from "./ScatterplotGraph.module.css";

import * as d3 from "d3";
import { useWindowSize } from "../../hooks/useWindowSize.js";
import { useFetch } from "../../hooks/useFetch.js";

export function ScatterplotGraph() {
    const ref = useRef();
    const size = useWindowSize();
    const { data, loading } = useFetch(
        "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
    );

    useEffect(() => {
        const svg = d3.select(ref.current);

        const h = Math.floor(size.height * 0.8);
        const w = Math.floor(size.width * 0.9);
        const padding = 60;

        svg.style("background-color", "var(--color-3)")
            .style("height", `${h}px`)
            .style("width", `${w}px`);

        if (data && !loading) {
            console.log(data);

            const years = data.map((v) => new Date(v["Year"] + "-01-01"));
            const minYear = new Date(
                Math.min(...data.map((v) => v["Year"])) - 1 + "-09-01"
            );
            const maxYear = new Date(
                Math.max(...data.map((v) => v["Year"])) + 1 + "-01-01"
            );
            const times = data.map((v) => v["Seconds"]);

            const tooltip = d3.select("#tooltip");

            // barchart-label
            svg.append("text")
                .text("Doping in Professional Bicycle Racing")
                .attr("class", "labels")
                .attr("text-anchor", "middle")
                .attr("x", w / 2)
                .attr("y", 40)
                .attr("fill", "white")
                .style("font-size", "2rem")
                .style("font-weight", "bold")
                .style("text-decoration", "underline");

            // y-axis-label
            svg.append("text")
                .text("Time")
                .attr("class", "labels")
                .attr("text-anchor", "end")
                .attr("x", padding)
                .attr("y", 40)
                .attr("fill", "white")
                .style("font-size", "1.2rem")
                .style("text-decoration", "underline");

            // x-axis-label
            svg.append("text")
                .text("Year")
                .attr("class", "labels")
                .attr("text-anchor", "end")
                .attr("x", w - 20)
                .attr("y", h - 20)
                .attr("fill", "white")
                .style("font-size", "1.2rem")
                .style("text-decoration", "underline");

            // source
            // svg.append("text")
            //     .text("Source: " + data["source_name"])
            //     .attr("class", "labels")
            //     .attr("text-anchor", "start")
            //     .attr("x", padding)
            //     .attr("y", h - 20)
            //     .attr("fill", "white")
            //     .style("font-style", "italic")
            //     .style("font-size", "1rem");

            const formatTime = (s) => {
                let min = Math.floor(s / 60);
                let sec = Math.floor(s % 60);
                return `${min < 10 ? "0" + min : min}:${
                    sec < 10 ? "0" + sec : sec
                }`;
            };

            const xScale = d3
                .scaleTime()
                // .domain([d3.min(years), d3.max(years)])
                .domain([minYear, maxYear])
                .range([padding, w - padding]);

            const yScale = d3
                .scaleLinear()
                .domain([d3.min(times) - 10, d3.max(times) + 10])
                .range([h - padding, padding]);

            const xAxis = d3.axisBottom(xScale).ticks(years.length);
            svg.select("#x-axis")
                .attr("transform", "translate(0," + (h - padding) + ")")
                .style("color", "white")
                .style("font-size", "0.75rem")
                .style("font-weight", "bold")
                .call(xAxis);

            const yAxis = d3.axisLeft(yScale).ticks(13).tickFormat(formatTime);
            svg.select("#y-axis")
                .attr("transform", "translate(" + padding + ", 0)")
                .style("color", "white")
                .style("font-size", "0.75rem")
                .style("font-weight", "bold")
                .call(yAxis);

            svg.selectAll("circle")
                .data(data)
                .enter()
                .append("circle")
                .attr("class", "dot")
                .attr("id", (d, i) => `dot${i + 1}`)
                .attr("data-xvalue", (d) => new Date(d["Year"] + "-01-01"))
                .attr("data-yvalue", (d) => d["Seconds"])
                .attr("cx", (d) => xScale(new Date(d["Year"] + "-01-01")))
                .attr("cy", (d) => yScale(d["Seconds"]))
                .attr("r", "5px")
                .attr("fill", "navy")
                .attr("opacity", "0.5");
        }
    }, [ref, size, data, loading]);

    return (
        <div className={styles.scatterplotgraph}>
            <h2 id="title">d3 scatterplot graph implementation example</h2>
            <svg ref={ref}>
                <g id="x-axis" />
                <g id="y-axis" />
            </svg>
            <div
                id="tooltip"
                style={{
                    position: "absolute",
                    bottom: "",
                    left: "",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    width: "200px",
                    height: "125px",
                    backgroundColor: "greenyellow",
                    borderRadius: "25px",
                    opacity: "0",
                    color: "#404040",
                    pointerEvents: "none",
                    zIndex: "9999999",
                }}
            ></div>
        </div>
    );
}
