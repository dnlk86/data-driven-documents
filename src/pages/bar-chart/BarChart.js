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
            const dates = dataset.map((v) => new Date(v[0]));
            const numbers = dataset.map((v) => v[1]);
            // const barWidth = w / (dataset.length * 2 - 1);
            const barWidth = w / dataset.length - 2;

            console.log(dates);
            console.log(numbers);

            const tooltip = d3.select("#tooltip");

            svg.append("text")
                .text("USA quarter GDP")
                .attr("x", -500)
                .attr("y", +100)
                .attr("transform", "rotate(-90)");

            const xScale = d3
                .scaleTime()
                .domain([d3.min(dates), d3.max(dates)])
                .range([padding, w - padding]);

            const yScale = d3
                .scaleLinear()
                .domain([0, d3.max(numbers)])
                .range([h - padding, padding]);

            const xAxis = d3.axisBottom(xScale);
            svg.select("#x-axis")
                .attr("transform", "translate(0," + (h - padding) + ")")
                .call(xAxis);

            const yAxis = d3.axisLeft(yScale);
            svg.select("#y-axis")
                .attr("transform", "translate(" + padding + ", 0)")
                .call(yAxis);

            svg.selectAll("rect")
                .data(dataset)
                .enter()
                .append("rect")
                .attr("class", "bar")
                .attr("id", (d, i) => `bar${i + 1}`)
                .attr("data-date", (d) => d[0])
                .attr("data-gdp", (d) => d[1])
                .attr("x", (d, i) => xScale(dates[i]))
                .attr("y", (d) => yScale(d[1]))
                .attr("width", barWidth)
                .attr("height", (d) => h - yScale(d[1]) - padding)
                .attr("fill", "navy")
                .on("mouseover", (e, v) => {
                    let val = String(v).split(",");
                    tooltip.transition().duration(100).style("opacity", 0.5);
                    tooltip.html("d: " + val[0] + "<br />v: " + val[1]);
                    d3.select(e.currentTarget).style("fill", "greenyellow");
                })
                .on("mouseout", (e, v) => {
                    tooltip.transition().duration(100).style("opacity", 0);
                    tooltip.html("");
                    d3.select(e.currentTarget).style("fill", "navy");
                });
        }
    }, [ref, size, data, loading]);

    return (
        <div className={styles.barchart}>
            <h2 id="title">Bar Chart</h2>
            <svg ref={ref}>
                <g id="x-axis" />
                <g id="y-axis" />
            </svg>
            <div
                id="tooltip"
                style={{
                    position: "absolute",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    width: "250px",
                    height: "125px",
                    backgroundColor: "blueviolet",
                    borderRadius: "25px",
                    opacity: "0",
                    zIndex: "9999999",
                }}
            ></div>
        </div>
    );
}
