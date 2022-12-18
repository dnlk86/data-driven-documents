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
        // const padding = 60;

        svg.style("background-color", "var(--color-3)")
            .style("height", `${h}px`)
            .style("width", `${w}px`);

        if (data && !loading) {
            console.log(data);
        }
    }, [ref, size, data, loading]);

    return (
        <div className={styles.scatterplotgraph}>
            <h2 id="title">d3 scatterplot graph implementation example</h2>
            <svg ref={ref}>
                {/* <g id="x-axis" /> */}
                {/* <g id="y-axis" /> */}
            </svg>
        </div>
    );
}
