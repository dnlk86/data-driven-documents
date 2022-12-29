import React, { useEffect, useRef } from "react";
import styles from "./ChoroplethMap.module.css";
import * as topojson from "topojson-client";
import * as d3 from "d3";
import { geoPath } from "d3-geo";

// import { useWindowSize } from "../../hooks/useWindowSize.js";
// import { useFetch } from "../../hooks/useFetch.js";

export function ChoroplethMap() {
    const ref = useRef();
    // const size = useWindowSize();
    // const { countyData, countyLoading } = useFetch(
    //     "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"
    // );
    // const { eduData, eduLoading } = useFetch(
    //     "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"
    // );

    useEffect(() => {
        const svg = d3.select(ref.current);

        const h = window.innerHeight * 0.8;
        const w = window.innerWidth * 0.9;
        // const h = Math.floor(size.height * 0.8);
        // const w = Math.floor(size.width * 0.9);
        // const padding = 100;

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
            console.log(countyData);
            console.log(eduData);

            console.log(h);
            console.log(w);

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
                    return "rgb(69, 117, 180)";
                } else if (bachelorsOrHigher < 20) {
                    return "rgb(116, 173, 209)";
                } else if (bachelorsOrHigher < 30) {
                    return "rgb(171, 217, 233)";
                } else if (bachelorsOrHigher < 40) {
                    return "rgb(224, 243, 248)";
                } else if (bachelorsOrHigher < 50) {
                    return "rgb(255, 255, 191)";
                } else if (bachelorsOrHigher < 60) {
                    return "rgb(254, 224, 144)";
                } else {
                    return "rgb(165, 0, 38)";
                }
            };

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
                .attr("stroke", "grey")
                .style("stroke-width", "0.5px")
                // .attr("fill", (d) => {
                //     let data = eduData.filter(
                //         (county) => county.fips === d.id
                //     )[0];
                //     if (data) {
                //         return countyFill(data.bachelorsOrHigher);
                //     } else {
                //         return "fff";
                //     }
                // })
                .attr("fill", (d) =>
                    countyFill(
                        eduData.filter((county) => county.fips === d.id)[0]
                            .bachelorsOrHigher
                    )
                );
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

                <g id="legend"></g>
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
