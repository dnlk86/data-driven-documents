import React, { useEffect, useRef } from "react";
import styles from "./ChoroplethMap.module.css";

import * as d3 from "d3";
import { useWindowSize } from "../../hooks/useWindowSize.js";
import { useFetch } from "../../hooks/useFetch.js";

export function ChoroplethMap() {
    const ref = useRef();
    const size = useWindowSize();
    // const { countyData, countyLoading } = useFetch(
    //     "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"
    // );
    // const { eduData, eduLoading } = useFetch(
    //     "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"
    // );

    useEffect(() => {
        const svg = d3.select(ref.current);

        const h = Math.floor(size.height * 0.8);
        const w = Math.floor(size.width * 0.9);
        const padding = 100;

        svg.style("background-color", "var(--color-1)")
            .style("height", `${h}px`)
            .style("width", `${w}px`);

        const loadData = async () => {
            const { countyData } = await fetch(
                "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"
            );
            const { eduData } = await fetch(
                "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"
            );

            return countyData, eduData;
        };

        loadData().then((countyData, eduData) => {
            console.log(countyData);
            console.log(eduData);

            const tooltip = d3.select("#tooltip");

            // choropleth-title
            svg.append("text")
                .text("United States Educational Attainment")
                .attr("id", "title")
                .attr("class", "labels")
                .attr("text-anchor", "middle")
                .attr("x", w / 2)
                .attr("y", 30)
                .attr("fill", "var(--color-5)")
                .style("font-size", "1.5rem")
                .style("text-decoration", "underline");

            // choropleth-description
            svg.append("text")
                .text(
                    "Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)"
                )
                .attr("id", "description")
                .attr("class", "labels")
                .attr("text-anchor", "middle")
                .attr("x", w / 2)
                .attr("y", 60)
                .attr("fill", "var(--color-5)")
                .style("font-size", "1.0rem")
                .style("text-decoration", "underline");
        });
    }, [ref, size, countyData, countyLoading, eduData, eduLoading]);

    return (
        <div className={styles.choroplethMap}>
            <h2 id="page-title">d3 choropleth map example</h2>
            <svg ref={ref}>
                <g id="x-axis" />
                <g id="y-axis" />
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
                    width: "250px",
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
