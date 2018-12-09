import * as d3 from "d3";
import drawTreeMap from "./drawTreeMap";
import { drawLegend } from "./drawLegend";
import { dropDownMenu } from "./dropDown";
// Helpful resources
// https://stackoverflow.com/questions/43098812/adding-variable-amount-of-tspan-elements-to-text-depending-on-d-attribute-in-d3
// https://codepen.io/AA87/pen/EGYzWr?editors=0010

const svg = d3.select("svg");
const svgLegend = d3.select("#svgLegend");

// URLS
const moviesUrl =
  "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json";
const kickUrl =
  "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/kickstarter-funding-data.json";
const videoUrl =
  "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json";

const options = ["Movies Sales", "Kickstarter Pledges", "Video Game Sales"];

let selectedOption = options[0];

// CONSTANTS
const width = +svg.attr("width");
const height = +svg.attr("height");
const margin = { top: 40, left: 20, right: 20, bottom: 0 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;
const textXOffset = 3;
const textYOffset = 12;
const legendRectWidth = 30;
const legendRectHeight = 30;

// SCALES
const colorScale = d3.scaleOrdinal();
// STATE
let data;
let moviesData;
let kickData;
let videoData;

const selector = {
  [options[0]]: moviesData,
  [options[1]]: kickData,
  [options[2]]: videoData
};

function onOptionClick(option) {
  selectedOption = option;
  console.log(selector);
  data = selector[option];
  render();
}

Promise.all([d3.json(moviesUrl), d3.json(kickUrl), d3.json(videoUrl)]).then(
  ([mData, kData, vData]) => {
    console.log("mData", mData);
    console.log("kData", kData);
    console.log("vData", vData);
    selector[options[0]] = mData;
    selector[options[1]] = kData;
    selector[options[2]] = vData;
    moviesData = mData;
    kickData = kData;
    videoData = vData;
    data = moviesData;
    colorScale.domain(data.children.map(obj => obj.name));
    colorScale.range(d3.schemeCategory10.slice(0, colorScale.domain().length));
    render();
  }
);

function render() {
  drawTreeMap(svg, {
    innerHeight,
    innerWidth,
    data,
    colorScale,
    textXOffset,
    textYOffset
  });

  drawLegend(svgLegend, {
    colorScale,
    data,
    innerHeight,
    innerWidth,
    legendRectHeight,
    legendRectWidth
  });

  dropDownMenu(d3.select("#menu"), {
    options,
    onOptionClick,
    selectedOption
  });
}
