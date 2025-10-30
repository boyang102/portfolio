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
    const rolledData = d3.rollups(
      projects,
      (v) => v.length,
      (d) => d.year
    );

    // Convert to [{ label, value }]
    const data = rolledData.map(([year, count]) => ({
      label: year,
      value: count,
    }));

    // ---------- Draw Pie Chart ----------
    const svg = d3.select("#projects-pie-plot");
    const colors = d3.scaleOrdinal(d3.schemeTableau10);

    const sliceGenerator = d3.pie().value((d) => d.value);
    const arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
    const arcData = sliceGenerator(data);

    // Clear old paths
    svg.selectAll("*").remove();

    arcData.forEach((d, idx) => {
      svg
        .append("path")
        .attr("d", arcGenerator(d))
        .attr("fill", colors(idx))
        .attr("stroke", "white")
        .attr("stroke-width", 0.5);
    });

    // ---------- ✅ Draw Legend ----------
    const legend = d3.select(".legend");
    legend.selectAll("*").remove(); // 清空旧的 legend

    data.forEach((d, idx) => {
      legend
        .append("li")
        .attr("style", `--color:${colors(idx)}`)
        .html(`
          <span class="swatch"></span>
          <strong>${d.label}</strong> <em>(${d.value})</em>
        `);
    });

    console.log("✅ Legend rendered:", data);

    // ---------- Render Projects Below ----------
    const container = document.querySelector(".projects");
    renderProjects(projects, container, "h2");
  } catch (err) {
    console.error("Error loading or rendering projects:", err);
  }
}

loadProjects();