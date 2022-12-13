import React from "react";
import styles from "./Home.module.css";

export function Home() {
    return (
        <div className={styles.homepage}>
            <h1>Welcome to my d3 project's collection website.</h1>
            <br />
            <p>
                D3 (or D3.js) is a JavaScript library for visualizing data using
                web standards such as SVG, Canvas and HTML.
            </p>
            <br />
            <h2>
                About this website and the technologies I used to develop it.
            </h2>
            <br />
            <p>
                I used React.js to build this collection, together with the
                react-router package, in order to have a better separation
                between different projects.
            </p>
            <br />
            <h3>List of technologies:</h3>
            <br />
            <ul>
                <li>react.js using create-react-app</li>
                <li>react-router-dom</li>
                <li>d3.js</li>
                <li>gh-pages for deployment</li>
            </ul>
        </div>
    );
}
