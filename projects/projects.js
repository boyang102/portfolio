// projects.js
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { renderProjects } from "../global.js";

// ---------- Step 3: Plot Projects Per Year + Legend ----------
async function loadProjects() {
  try {
    const response = await fetch("../lib/projects.json");
    if (!response.ok) throw new Error("Failed to load projects.json");
    const projects = await response.json();

    // ---------- Roll up counts per year ----------
    let rolledData = d3.rollups(
      projects,
      (v) => v.length,
      (d) => d.year
    );

    // Convert to {label,value}
    let data = rolledData.map(([year, count]) => ({ label: year, value: count }));

    // ---------- Draw Pie Chart ----------
    let svg = d3.select("#projects-pie-plot");
    let colors = d3.scaleOrdinal(d3.schemeTableau10);

    let sliceGenerator = d3.pie().value((d) => d.value);
    let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
    let arcData = sliceGenerator(data);

    // Clear old paths
    svg.selectAll("path").remove();

    arcData.forEach((d, idx) => {
      svg
        .append("path")
        .attr("d", arcGenerator(d))
        .attr("fill", colors(idx))
        .attr("stroke", "white")
        .attr("stroke-width", 0.5);
    });

    // ---------- Draw Legend ----------
    let legend = d3.select(".legend");
    legend.selectAll("*").remove(); // clear old legend
    data.forEach((d, idx) => {
      legend
        .append("li")
        .attr("style", `--color:${colors(idx)}`)
        .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
    });

    // ---------- Render Projects Below ----------
    const container = document.querySelector(".projects");
    renderProjects(projects, container, "h2");
  } catch (err) {
    console.error("Error loading or rendering projects:", err);
  }
}

loadProjects();