// projects.js
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { renderProjects } from "../global.js";

async function loadProjects() {
  try {
    const response = await fetch("../lib/projects.json");
    if (!response.ok) throw new Error("Failed to load projects.json");
    const projects = await response.json();

    // ---------- Step 3: Group projects by year ----------
    const rolledData = d3.rollups(
      projects,
      (v) => v.length,
      (d) => d.year
    );

    // Convert rolled data to [{ label, value }]
    const data = rolledData.map(([year, count]) => ({
      label: year,
      value: count,
    }));

    // ---------- Step 3.1: Draw Pie Chart ----------
    const svg = d3.select("#projects-pie-plot");
    const colors = d3.scaleOrdinal(d3.schemeTableau10);

    const sliceGenerator = d3.pie().value((d) => d.value);
    const arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
    const arcData = sliceGenerator(data);

    // Clear previous chart (important when re-rendering)
    svg.selectAll("*").remove();

    arcData.forEach((d, idx) => {
      svg
        .append("path")
        .attr("d", arcGenerator(d))
        .attr("fill", colors(idx))
        .attr("stroke", "white")
        .attr("stroke-width", 0.5);
    });

    // ---------- ✅ Step 3.2: Draw Legend ----------
    const legend = d3.select(".legend");
    legend.selectAll("*").remove(); // 清空旧 legend

    data.forEach((d, idx) => {
      legend
        .append("li")
        .attr("style", `--color:${colors(idx)}`)
        .html(`
          <span class="swatch"></span>
          <strong>${d.label}</strong> <em>(${d.value})</em>
        `);
    });

    console.log("✅ Legend rendered successfully:", data);

    // ---------- Step 3.3: Render Project Cards ----------
    const container = document.querySelector(".projects");
    renderProjects(projects, container, "h2");
  } catch (err) {
    console.error("❌ Error loading or rendering projects:", err);
  }
}

loadProjects();