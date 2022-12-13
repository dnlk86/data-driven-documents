import React, { useEffect, useRef } from "react";
import styles from "./BarChart.module.css";

import * as d3 from "d3";

export function BarChart() {
    const ref = useRef();
    useEffect(() => {
        const svg = d3.select(ref.current);

        svg.style("background-color", "var(--color-3)")
            .style("height", "80vh")
            .style("width", "90vw");
    }, ref);

    return (
        <div className={styles.barchart}>
            <h2 id="title">Bar Chart</h2>
            <svg
                ref={ref}
                // style={{
                //     height: "80vh",
                //     width: "90vw",
                //     backgroundColor: "var(--color-3)",
                // }}
            >
                <g className="plot-area" />
                <g id="x-axis" />
                <g id="y-axis" />
            </svg>
        </div>
    );
}
