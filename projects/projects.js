// projects.js
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { renderProjects } from "../global.js";  // ✅ 保留原来的项目渲染函数

// ---------- Step 1: D3 Pie Chart ----------
const svg = d3
  .select('#projects-pie-plot')
  .attr('viewBox', '-50 -50 100 100');

// Example dataset
let data = [1, 2, 3, 4, 5, 5];

// Arc generator: defines radius
let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);

// Pie layout generator: calculates slice angles
let sliceGenerator = d3.pie();

// Compute arc data
let arcData = sliceGenerator(data);

// D3 color palette
let colors = d3.scaleOrdinal(d3.schemeTableau10);

// Append slices to SVG
arcData.forEach((d, idx) => {
  svg.append('path')
    .attr('d', arcGenerator(d))
    .attr('fill', colors(idx))
    .attr('stroke', 'white')
    .attr('stroke-width', 0.5);
});

// ---------- Step 2: Render Project List ----------
fetch("../lib/projects.json")
  .then((response) => response.json())
  .then((projects) => {
    renderProjects(projects);  // ✅ 保留原始项目模块渲染逻辑
  })
  .catch((error) => {
    console.error("Error loading projects:", error);
  });