import React, { useEffect, useRef } from "react";
import styles from "./BarChart.module.css";

import * as d3 from "d3";
import { useWindowSize } from "../../hooks/useWindowSize.js";
import { useFetch } from "../../hooks/useFetch.js";

export function BarChart() {
    const ref = useRef();
    const size = useWindowSize();
    const { data: data, loading } = useFetch(
        "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
    );

    console.log(loading);
    console.log(data);

    useEffect(() => {
        const svg = d3.select(ref.current);

        const h = Math.floor(size.height * 0.8);
        const w = Math.floor(size.width * 0.9);

        svg.style("background-color", "var(--color-3)")
            .style("height", `${h}px`)
            .style("width", `${w}px`);
    }, [ref, size, data]);

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
