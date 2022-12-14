import React, { useEffect, useRef } from "react";
import styles from "./BarChart.module.css";

import * as d3 from "d3";
import { useWindowSize } from "../../hooks/useWindowSize.js";
import { useFetch } from "../../hooks/useFetch.js";

export function BarChart() {
    const ref = useRef();
    const size = useWindowSize();
    const { data, loading } = useFetch(
        "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
    );

    useEffect(() => {
        const svg = d3.select(ref.current);

        const h = Math.floor(size.height * 0.8);
        const w = Math.floor(size.width * 0.9);
        const padding = 50;

        svg.style("background-color", "var(--color-3)")
            .style("height", `${h}px`)
            .style("width", `${w}px`);

        if (data && !loading) {
            const dataset = data.data;

            const xScale = d3
                .scaleLinear()
                .domain([
                    d3.min(dataset, (d) => d[0].split("-")[0]),
                    d3.max(dataset, (d) => d[0].split("-")[0]),
                ])
                .range([padding, w - padding]);

            const xAxis = d3.axisBottom(xScale);
            svg.select("#x-axis")
                .attr("transform", "translate(0," + (h - padding) + ")")
                .call(xAxis);

            const yScale = d3
                .scaleLinear()
                .domain([
                    d3.min(dataset, (d) => d[1]),
                    d3.max(dataset, (d) => d[1]),
                ])
                .range([h - padding, padding]);

            const yAxis = d3.axisLeft(yScale);
            svg.select("#y-axis")
                .attr("transform", "translate(" + padding + ", " + 0 + ")")
                .call(yAxis);
        }
    }, [ref, size, data, loading]);

    return (
        <div className={styles.barchart}>
            <h2 id="title">Bar Chart</h2>
            <svg ref={ref}>
                {/* <g className="plot-area" /> */}
                <g id="x-axis" />
                <g id="y-axis" />
            </svg>
        </div>
    );
}
