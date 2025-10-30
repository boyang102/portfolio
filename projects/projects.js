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
  let selectedIndex = -1;

  // ---------- Helper: Group projects per year ----------
  function groupData(projectsGiven) {
    const rolled = d3.rollups(projectsGiven, (v) => v.length, (d) => d.year);
    return rolled.map(([year, count]) => ({ label: year, value: count }));
  }

  // ---------- Core: Render Pie Chart + Legend ----------
  function renderPieChart(projectsGiven) {
    const data = groupData(projectsGiven);
    const sliceGenerator = d3.pie().value((d) => d.value);
    const arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
    const arcData = sliceGenerator(data);

    svg.selectAll("*").remove();
    legend.selectAll("*").remove();

    // Draw arcs
    arcData.forEach((d, i) => {
      svg
        .append("path")
        .attr("d", arcGenerator(d))
        .attr("fill", colors(i))
        .attr("stroke", "white")
        .attr("stroke-width", 0.5)
        .attr("cursor", "pointer")
        .on("click", () => {
          selectedIndex = selectedIndex === i ? -1 : i;
          updateFilteredProjects();
        });
    });

    // Draw legend
    data.forEach((d, i) => {
      legend
        .append("li")
        .attr("style", `--color:${colors(i)}`)
        .attr("class", i === selectedIndex ? "selected" : "")
        .html(
          `<span class="swatch"></span> <strong>${d.label}</strong> <em>(${d.value})</em>`
        )
        .on("click", () => {
          selectedIndex = selectedIndex === i ? -1 : i;
          updateFilteredProjects();
        });
    });
  }

  // ---------- Helper: Filter logic ----------
  function filterProjects() {
    let filtered = projects.filter((p) => {
      let values = Object.values(p).join(" ").toLowerCase();
      return values.includes(query.toLowerCase());
    });

    if (selectedIndex !== -1) {
      const selectedYear = groupData(projects)[selectedIndex].label;
      filtered = filtered.filter((p) => p.year === selectedYear);
    }

    return filtered;
  }

  // ---------- Update rendered projects + chart ----------
  function updateFilteredProjects() {
    const filtered = filterProjects();
    renderProjects(filtered, projectsContainer, "h2");
    renderPieChart(filtered);
  }

  // ---------- Search event ----------
  searchInput.addEventListener("input", (e) => {
    query = e.target.value;
    updateFilteredProjects();
  });

  // ---------- Initial render ----------
  renderProjects(projects, projectsContainer, "h2");
  renderPieChart(projects);
}

loadProjects();