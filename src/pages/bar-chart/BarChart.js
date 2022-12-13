import React, { useEffect, useRef } from "react";
import styles from "./BarChart.module.css";

import * as d3 from "d3";
import { useWindowSize } from "../../hooks/useWindowSize.js";

export function BarChart() {
    const ref = useRef();
    const size = useWindowSize();

    useEffect(() => {
        const svg = d3.select(ref.current);

        const h = size.height * 0.8;
        const w = size.width * 0.9;

        svg.style("background-color", "var(--color-3)")
            .style("height", `${h}px`)
            .style("width", `${w}px`);
    }, [ref, size]);

    return (
        <div className={styles.barchart}>
            <h2 id="title">Bar Chart</h2>
            <svg ref={ref}>
                <g className="plot-area" />
                <g id="x-axis" />
                <g id="y-axis" />
            </svg>
        </div>
    );
}
