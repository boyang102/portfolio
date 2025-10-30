// projects.js
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { renderProjects } from "../global.js"; // ✅ 导入函数

// ---------- Step 1: D3 Pie Chart ----------
const svg = d3
  .select('#projects-pie-plot')
  .attr('viewBox', '-50 -50 100 100');

let data = [1, 2, 3, 4, 5, 5]; // Example dataset
let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
let sliceGenerator = d3.pie();
let arcData = sliceGenerator(data);
let colors = d3.scaleOrdinal(d3.schemeTableau10);

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
    // ✅ 正确调用 renderProjects()，并传入容器元素
    const container = document.querySelector(".projects");
    renderProjects(projects, container, "h2");
  })
  .catch((error) => {
    console.error("Error loading projects:", error);
  });