import React, { useEffect, useRef } from "react";
import styles from "./ChoroplethMap.module.css";

import * as d3 from "d3";
import { useWindowSize } from "../../hooks/useWindowSize.js";
import { useFetch } from "../../hooks/useFetch.js";

export function ChoroplethMap() {
    const ref = useRef();
    const size = useWindowSize();
    const { countyData, countyLoading } = useFetch(
        "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"
    );
    const { eduData, eduLoading } = useFetch(
        "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"
    );

    useEffect(() => {
        const svg = d3.select(ref.current);

        const h = Math.floor(size.height * 0.8);
        const w = Math.floor(size.width * 0.9);
        const padding = 100;

        svg.style("background-color", "var(--color-1)")
            .style("height", `${h}px`)
            .style("width", `${w}px`);

        if (countyData && !countyLoading && eduData && !eduLoading) {
            console.log(countyData);
        }
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
