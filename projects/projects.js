// projects.js
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { renderProjects } from "../global.js";

async function loadProjects() {
  const response = await fetch("../lib/projects.json");
  const projects = await response.json();

  const projectsContainer = document.querySelector(".projects");
  const searchInput = document.querySelector(".searchBar");
  const svg = d3.select("#projects-pie-plot");
  const legend = d3.select(".legend");
  const colors = d3.scaleOrdinal(d3.schemeTableau10);

  let query = "";
  let selectedYear = null;

  // Group projects by year
  function groupData(data) {
    const rolled = d3.rollups(data, (v) => v.length, (d) => d.year);
    return rolled.map(([year, count]) => ({ label: year, value: count }));
  }

  // Render Pie + Legend
  function renderPieChart(projectList) {
    const data = groupData(projectList);
    svg.selectAll("*").remove();
    legend.selectAll("*").remove();

    const sliceGenerator = d3.pie().value((d) => d.value);
    const arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
    const arcData = sliceGenerator(data);

    // Draw arcs
    const arcs = svg
      .selectAll("path")
      .data(arcData)
      .join("path")
      .attr("d", arcGenerator)
      .attr("fill", (_, i) => colors(i))
      .attr("stroke", "white")
      .attr("stroke-width", 0.5)
      .attr("cursor", "pointer")
      .on("click", (_, d) => {
        selectedYear = selectedYear === d.data.label ? null : d.data.label;
        update();
      });

    // Draw legend
    const legendItems = legend
      .selectAll("li")
      .data(data)
      .join("li")
      .attr("style", (_, i) => `--color:${colors(i)}`)
      .attr("class", (d) =>
        d.label === selectedYear ? "selected" : ""
      )
      .html(
        (d) =>
          `<span class="swatch"></span><strong>${d.label}</strong> <em>(${d.value})</em>`
      )
      .on("click", (_, d) => {
        selectedYear = selectedYear === d.label ? null : d.label;
        update();
      });

    // Highlight selected arc
    arcs.attr("class", (d) =>
      d.data.label === selectedYear ? "selected" : null
    );
  }

  // Filter by search + selected year
  function getFilteredProjects() {
    return projects.filter((p) => {
      const text = Object.values(p).join(" ").toLowerCase();
      const matchQuery = text.includes(query.toLowerCase());
      const matchYear = !selectedYear || p.year === selectedYear;
      return matchQuery && matchYear;
    });
  }

  // Update both sections
  function update() {
    const filtered = getFilteredProjects();
    renderProjects(filtered, projectsContainer, "h2");
    renderPieChart(filtered);
  }

  // Live search
  searchInput.addEventListener("input", (e) => {
    query = e.target.value;
    update();
  });

  // Initial render
  renderProjects(projects, projectsContainer, "h2");
  renderPieChart(projects);
}

loadProjects();