import React from "react";
import styles from "./Home.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

export function Home() {
    return (
        <div className={styles.homepage}>
            <h1>Welcome to my d3 project collection website.</h1>
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
                I developed this project as a collection of d3 charts for the
                relative section of the freeCodeCamp curriculum.
                <br />I used React.js together with the react-router package to
                build it, in order to have a better separation between the
                different charts.
            </p>
            <br />
            <h3>List of technologies:</h3>
            <br />
            <ul>
                <li>react.js using create-react-app</li>
                <li>react-router-dom for routing</li>
                <li>d3.js for all charts</li>
                <li>axios for API requests</li>
                <li>gh-pages for deployment</li>
                <li>fontawesome for icons</li>
                <li>d3-geo & topojson-client for maps</li>
            </ul>
            <br />
            <h3>A sidenote.</h3>
            <br />
            <p>
                The way I decided to structure the project and the technologies
                I used might seem a little overkill. That was exactly the goal I
                set for this project, I wanted to test the d3.js functionalities
                and at the same time see how all those technologies fit together
                in a relatively simple but fully functioning case study.
            </p>
            <br />
            <h3>Link to the repository of this project:</h3>
            <br />
            <a
                href="https://github.com/dnlk86/data-driven-documents"
                target="_blank"
                rel="noreferrer"
            >
                <FontAwesomeIcon icon={faGithub} /> GitHub
            </a>
        </div>
    );
}
