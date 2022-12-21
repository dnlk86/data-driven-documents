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
        const padding = 60;

        svg.style("background-color", "var(--color-1)")
            .style("height", `${h}px`)
            .style("width", `${w}px`);

        if (data && !loading) {
            console.log(data);

            //     const dataset = data.data;
            //     const dates = dataset.map((v) => new Date(v[0]));
            //     const numbers = dataset.map((v) => v[1]);
            //     const barWidth = w / dataset.length - 2;

            //     const tooltip = d3.select("#tooltip");

            //     // barchart-title
            //     svg.append("text")
            //         .text("USA quarterly GDP data")
            //         .attr("class", "labels")
            //         .attr("text-anchor", "middle")
            //         .attr("x", w / 2)
            //         .attr("y", 40)
            //         .attr("fill", "var(--color-5)")
            //         .style("font-size", "1.5rem")
            //         .style("text-decoration", "underline");

            //     // y-axis-label
            //     svg.append("text")
            //         .text("GDP")
            //         .attr("class", "labels")
            //         .attr("text-anchor", "end")
            //         .attr("x", padding)
            //         .attr("y", 40)
            //         .attr("fill", "var(--color-5)")
            //         .style("font-size", "1.2rem")
            //         .style("text-decoration", "underline");

            //     // x-axis-label
            //     svg.append("text")
            //         .text("Year")
            //         .attr("class", "labels")
            //         .attr("text-anchor", "end")
            //         .attr("x", w - 20)
            //         .attr("y", h - 20)
            //         .attr("fill", "var(--color-5)")
            //         .style("font-size", "1.2rem")
            //         .style("text-decoration", "underline");

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

            //     const xScale = d3
            //         .scaleTime()
            //         .domain([d3.min(dates), d3.max(dates)])
            //         .range([padding, w - padding]);

            //     const yScale = d3
            //         .scaleLinear()
            //         .domain([0, d3.max(numbers)])
            //         .range([h - padding, padding]);

            //     const xAxis = d3.axisBottom(xScale);
            //     svg.select("#x-axis")
            //         .attr("transform", "translate(0," + (h - padding) + ")")
            //         .style("color", "var(--color-5)")
            //         .style("font-size", "0.75rem")
            //         .style("font-weight", "bold")
            //         .call(xAxis);

            //     const yAxis = d3.axisLeft(yScale);
            //     svg.select("#y-axis")
            //         .attr("transform", "translate(" + padding + ", 0)")
            //         .style("color", "var(--color-5)")
            //         .style("font-size", "0.75rem")
            //         .style("font-weight", "bold")
            //         .call(yAxis);

            //     const getQuarter = (month) => {
            //         switch (month) {
            //             case "01":
            //                 return "Q1";
            //             case "04":
            //                 return "Q2";
            //             case "07":
            //                 return "Q3";
            //             default:
            //                 return "Q4";
            //         }
            //     };

            //     svg.selectAll("rect")
            //         .data(dataset)
            //         .enter()
            //         .append("rect")
            //         .attr("class", "bar")
            //         .attr("id", (d, i) => `bar${i + 1}`)
            //         .attr("data-date", (d) => d[0])
            //         .attr("data-gdp", (d) => d[1])
            //         .attr("x", (d, i) => xScale(dates[i]))
            //         .attr("y", (d) => yScale(d[1]))
            //         .attr("width", barWidth)
            //         .attr("height", (d) => h - yScale(d[1]) - padding)
            //         .attr("fill", "navy")
            //         .on("mouseover", (e, v) => {
            //             let val = String(v).split(",");
            //             let year = val[0].split("-")[0];
            //             let quarter = getQuarter(val[0].split("-")[1]);
            //             tooltip.transition().duration(100).style("opacity", 0.9);
            //             tooltip
            //                 .html(
            //                     "<p>" +
            //                         year +
            //                         " - " +
            //                         quarter +
            //                         "</p><p>" +
            //                         val[1] +
            //                         "<br /></p><p>Billion $</p>"
            //                 )
            //                 .attr("data-date", val[0])
            //                 .style(
            //                     "left",
            //                     Number(d3.select(e.currentTarget).attr("x")) +
            //                         padding +
            //                         "px"
            //                 )
            //                 .style(
            //                     "bottom",
            //                     h -
            //                         Number(d3.select(e.currentTarget).attr("y")) +
            //                         50 +
            //                         "px"
            //                 );
            //             d3.select(e.currentTarget)
            //                 .style("fill", "greenyellow")
            //                 .style("cursor", "pointer");
            //         })
            //         .on("mouseout", (e, v) => {
            //             tooltip.transition().duration(100).style("opacity", 0);
            //             tooltip.html("");
            //             d3.select(e.currentTarget).style("fill", "navy");
            //         });
        }
    }, [ref, size, data, loading]);

    return (
        <div className={styles.heatmap}>
            <h2 id="title">d3 heatmap example</h2>
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
                    width: "150px",
                    height: "max-content",
                    backgroundColor: "greenyellow",
                    borderRadius: "10px",
                    opacity: "0",
                    color: "var(--color-5)",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    pointerEvents: "none",
                    zIndex: "9999999",
                }}
            ></div>
        </div>
    );
}
