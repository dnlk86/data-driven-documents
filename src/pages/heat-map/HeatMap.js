import React, { useEffect, useRef } from "react";
import styles from "./HeatMap.module.css";

import * as d3 from "d3";
import { useWindowSize } from "../../hooks/useWindowSize.js";
import { useFetch } from "../../hooks/useFetch.js";

export function HeatMap() {
    const ref = useRef();
    const size = useWindowSize();
    const { data, loading } = useFetch(
        "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
    );

    useEffect(() => {
        const svg = d3.select(ref.current);

        const h = Math.floor(size.height * 0.8);
        const w = Math.floor(size.width * 0.9);
        const padding = 100;

        svg.style("background-color", "var(--color-1)")
            .style("height", `${h}px`)
            .style("width", `${w}px`);

        if (data && !loading) {
            console.log(data);

            const dataset = data.monthlyVariance;
            const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
            const years = dataset.map((v) => new Date(v.year + "-01-01"));
            // ADDING TWO EXTRA YEARS AT THE BEGINNING AND THE END OF THE "years" ARRAY FOR X-SCALE PURPOSES
            years.push(new Date("2016-01-01"));
            years.push(new Date("1752-01-01"));

            const variances = dataset.map((v) => v.variance);
            // console.log(Math.min(...variances));
            // console.log(Math.max(...variances));

            const cellWidth = w / (2015 - 1753 + 1);
            const cellHeight = (h - 2 * padding) / 12;

            const tooltip = d3.select("#tooltip");

            // heatmap-title
            svg.append("text")
                .text("Monthly Global Land-Surface Temperature")
                .attr("id", "title")
                .attr("class", "labels")
                .attr("text-anchor", "middle")
                .attr("x", w / 2)
                .attr("y", 30)
                .attr("fill", "var(--color-5)")
                .style("font-size", "1.5rem")
                .style("text-decoration", "underline");

            // heatmap-description
            svg.append("text")
                .text(`1753 - 2015: base temperature ${data.baseTemperature}℃`)
                .attr("id", "description")
                .attr("class", "labels")
                .attr("text-anchor", "middle")
                .attr("x", w / 2)
                .attr("y", 60)
                .attr("fill", "var(--color-5)")
                .style("font-size", "1.0rem")
                .style("text-decoration", "underline");

            // y-axis-label
            svg.append("text")
                .text("GDP")
                .attr("class", "labels")
                .attr("text-anchor", "end")
                .attr("x", padding)
                .attr("y", 40)
                .attr("fill", "var(--color-5)")
                .style("font-size", "1.2rem")
                .style("text-decoration", "underline");

            // x-axis-label
            svg.append("text")
                .text("Year")
                .attr("class", "labels")
                .attr("text-anchor", "end")
                .attr("x", w - 20)
                .attr("y", h - 20)
                .attr("fill", "var(--color-5)")
                .style("font-size", "1.2rem")
                .style("text-decoration", "underline");

            //     // source
            //     svg.append("text")
            //         .text("Source: " + data["source_name"])
            //         .attr("class", "labels")
            //         .attr("text-anchor", "start")
            //         .attr("x", padding)
            //         .attr("y", h - 20)
            //         .attr("fill", "var(--color-5)")
            //         .style("font-style", "italic")
            //         .style("font-size", "1rem");

            const xScale = d3
                .scaleTime()
                .domain([d3.min(years), d3.max(years)])
                .range([padding, w - padding]);

            const yScale = d3
                .scaleBand()
                .domain(months)
                .range([h - padding, padding]);

            const xAxis = d3.axisBottom(xScale);
            svg.select("#x-axis")
                .attr("transform", "translate(0," + (h - padding) + ")")
                .style("color", "var(--color-5)")
                .style("font-size", "0.75rem")
                .style("font-weight", "bold")
                .call(xAxis);

            console.log(months);

            const formatMonths = (n) => {
                let monthsArray = [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                ];
                return monthsArray[n - 1];
            };

            const yAxis = d3.axisLeft(yScale).tickFormat(formatMonths);
            svg.select("#y-axis")
                .attr("transform", "translate(" + padding + ", 0)")
                .style("color", "var(--color-5)")
                .style("font-size", "0.75rem")
                .style("font-weight", "bold")
                .call(yAxis);

            const cellFill = (variance) => {
                if (variance < -4) {
                    return "rgb(69, 117, 180)";
                } else if (variance < -3) {
                    return "rgb(116, 173, 209)";
                } else if (variance < -2) {
                    return "rgb(171, 217, 233)";
                } else if (variance < -1) {
                    return "rgb(224, 243, 248)";
                } else if (variance < 0) {
                    return "rgb(255, 255, 191)";
                } else if (variance < 1) {
                    return "rgb(254, 224, 144)";
                } else if (variance < 2) {
                    return "rgb(253, 174, 97)";
                } else if (variance < 3) {
                    return "rgb(244, 109, 67)";
                } else if (variance < 4) {
                    return "rgb(215, 48, 39)";
                } else {
                    return "rgb(165, 0, 38)";
                }
            };

            svg.selectAll("rect")
                .data(dataset)
                .enter()
                .append("rect")
                .attr("class", "cell")
                .attr("id", (d, i) => `cell${i + 1}`)
                .attr("data-year", (d) => d.year)
                .attr("data-month", (d) => d.month - 1)
                .attr("data-temp", (d) => data.baseTemperature + d.variance)
                .attr("x", (d) => xScale(new Date(d.year + "-01-01")))
                .attr("y", (d) => yScale(d.month))
                .attr("width", cellWidth)
                .attr("height", cellHeight)
                .attr("fill", (d) => cellFill(d.variance))
                .on("mouseover", (e, v) => {
                    tooltip.transition().duration(100).style("opacity", 0.9);
                    tooltip
                        .html(
                            `<p>Year: ${
                                v.year
                            }</p><br /><p>Month: ${formatMonths(
                                v.month
                            )}</p><br /><p>Variance: ${v.variance.toFixed(
                                3
                            )}°C</p><br /><p>Temperature: ${(
                                v.variance + data.baseTemperature
                            ).toFixed(3)}°C</p>`
                        )
                        .attr("data-year", v.year)
                        .style(
                            "left",
                            Number(d3.select(e.currentTarget).attr("x")) + "px"
                        )
                        .style(
                            "bottom",
                            h -
                                Number(d3.select(e.currentTarget).attr("y")) +
                                cellHeight / 2 +
                                "px"
                        );
                    d3.select(e.currentTarget)
                        .style("fill", "greenyellow")
                        .style("cursor", "pointer");
                })
                .on("mouseout", (e, v) => {
                    tooltip.transition().duration(100).style("opacity", 0);
                    tooltip.html("");
                    d3.select(e.currentTarget).style(
                        "fill",
                        cellFill(v.variance)
                    );
                });
        }
    }, [ref, size, data, loading]);

    return (
        <div className={styles.heatmap}>
            <h2 id="page-title">d3 heatmap example</h2>
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
