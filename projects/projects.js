// projects.js
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { renderProjects } from "../global.js";

// ---------- Step 1: D3 Pie Chart ----------
const svg = d3
  .select('#projects-pie-plot')
  .attr('viewBox', '-50 -50 100 100');

let data = [1, 2, 3, 4, 5, 5];
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

// ---------- Step 2: Fetch and Render Project List ----------
async function loadProjects() {
  try {
    const response = await fetch("../lib/projects.json");
    if (!response.ok) throw new Error("Failed to load projects.json");

    const projects = await response.json();
    const container = document.querySelector(".projects");

    if (!container) {
      console.error("❌ No .projects container found in HTML!");
      return;
    }

    console.log(`✅ Loaded ${projects.length} projects`);
    renderProjects(projects, container, "h2");
  } catch (err) {
    console.error("Error loading or rendering projects:", err);
  }
}

loadProjects();