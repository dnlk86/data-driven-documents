import React, { useEffect, useRef } from "react";
import styles from "./ChoroplethMap.module.css";
import * as topojson from "topojson-client";
import * as d3 from "d3";
import { geoPath } from "d3-geo";

export function ChoroplethMap() {
    const ref = useRef();

    useEffect(() => {
        const svg = d3.select(ref.current);

        const h = window.innerHeight * 0.8;
        const w = window.innerWidth * 0.9;
        const padding = 100;

        svg.style("background-color", "var(--color-1)")
            .style("height", `${h}px`)
            .style("width", `${w}px`);

        const loadData = async () => {
            const countyUrl =
                "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
            const eduUrl =
                "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
            const responses = await Promise.all([
                fetch(countyUrl),
                fetch(eduUrl),
            ]);
            const countyData = await responses[0].json();
            const eduData = await responses[1].json();
            return [countyData, eduData];
        };

        loadData().then((result) => {
            const countyData = result[0];
            const eduData = result[1];

            const tooltip = d3.select("#tooltip");

            // choropleth-title
            svg.select("#title")
                .append("text")
                .text("United States Educational Attainment")
                .attr("text-anchor", "middle")
                .attr("x", w / 2)
                .attr("y", 30)
                .attr("fill", "var(--color-5)")
                .style("font-size", "1.5rem")
                .style("text-decoration", "underline");

            // choropleth-description
            svg.select("#description")
                .append("text")
                .text(
                    "Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)"
                )
                .attr("text-anchor", "middle")
                .attr("x", w / 2)
                .attr("y", 60)
                .attr("fill", "var(--color-5)")
                .style("font-size", "1.0rem")
                .style("text-decoration", "underline");

            const projection = d3
                .geoIdentity()
                .scale(h / 700)
                .translate([w * 0.2, h * 0.1]);
            const path = geoPath().projection(projection);

            const countyFill = (bachelorsOrHigher) => {
                if (bachelorsOrHigher < 10) {
                    return "rgb(255, 255, 236)";
                } else if (bachelorsOrHigher < 20) {
                    return "rgb(255, 255, 191)";
                } else if (bachelorsOrHigher < 30) {
                    return "rgb(254, 224, 144)";
                } else if (bachelorsOrHigher < 40) {
                    return "rgb(253, 174, 97)";
                } else if (bachelorsOrHigher < 50) {
                    return "rgb(244, 109, 67)";
                } else if (bachelorsOrHigher < 60) {
                    return "rgb(215, 48, 39)";
                } else {
                    return "rgb(165, 0, 38)";
                }
            };

            const retrieveCounty = (id) =>
                eduData.filter((county) => county.fips === id)[0];

            svg.select("#map")
                .selectAll("path")
                .data(
                    topojson.feature(countyData, countyData.objects.counties)
                        .features
                )
                .enter()
                .append("path")
                .attr("id", (d) => "county_" + d.id)
                .attr("class", "county")
                .attr("d", path)
                .attr("data-fips", (d) => d.id)
                .attr(
                    "data-education",
                    (d) => retrieveCounty(d.id).bachelorsOrHigher
                )
                .attr("stroke", "grey")
                .style("stroke-width", "0.5px")
                .attr("fill", (d) =>
                    countyFill(retrieveCounty(d.id).bachelorsOrHigher)
                )
                .on("mouseover", (e, v) => {
                    let county = retrieveCounty(v.id);
                    tooltip.transition().duration(100).style("opacity", 0.9);
                    tooltip
                        .html(
                            `${county.area_name} (${county.state}): ${county.bachelorsOrHigher}%`
                        )
                        .attr("data-fips", county.fips)
                        .attr("data-education", county.bachelorsOrHigher)
                        .style("left", `${e.clientX}px`)
                        .style("bottom", `${h * 1.3 - e.clientY}px`);
                    d3.select(e.currentTarget)
                        .style("fill", "greenyellow")
                        .style("cursor", "pointer");
                })
                .on("mouseout", (e, v) => {
                    let county = retrieveCounty(v.id);
                    tooltip.transition().duration(100).style("opacity", 0);
                    tooltip.html("");
                    d3.select(e.currentTarget).style("fill", () =>
                        countyFill(county.bachelorsOrHigher)
                    );
                });

            const legendScale = d3
                .scaleBand()
                .domain([
                    "< 10%",
                    "< 20%",
                    "< 30%",
                    "< 40%",
                    "< 50%",
                    "< 60%",
                    "< 70%",
                ])
                .range([h - padding, padding]);

            const legend = d3.axisRight(legendScale);
            svg.select("#legend-scale")
                .attr("transform", "translate(" + (w - 80) + ", 0)")
                .style("color", "var(--color-5)")
                .style("font-size", "0.75rem")
                .style("font-weight", "bold")
                .call(legend);

            const legendRectHeight = (h - 2 * padding) / 7;
            d3.select("#legend")
                .selectAll("rect")
                .data([60, 50, 40, 30, 20, 10, 0])
                .enter()
                .append("rect")
                .attr("x", w - 90 + "px")
                .attr("y", (d, i) => padding + i * legendRectHeight)
                .attr("width", 10)
                .attr("height", legendRectHeight)
                .attr("fill", (d) => countyFill(d))
                .attr("stroke", "grey")
                .style("stroke-width", "0.5px");
        });
    }, [ref]);

    return (
        <div className={styles.choroplethMap}>
            <h2 id="page-title">d3 choropleth map example</h2>
            <svg ref={ref}>
                <g id="title"></g>
                <g id="description"></g>
                <g id="map-container">
                    <g id="map" />
                </g>
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
                    width: "max-content",
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
