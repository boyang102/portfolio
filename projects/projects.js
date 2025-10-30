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

  // ---------- Helper: group by year ----------
  function groupData(data) {
    const rolled = d3.rollups(data, (v) => v.length, (d) => d.year);
    return rolled.map(([year, count]) => ({ label: year, value: count }));
  }

  // ---------- Core render: Pie + Legend ----------
  function renderPieChart(projectList) {
    const data = groupData(projectList);

    const sliceGenerator = d3.pie().value((d) => d.value);
    const arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
    const arcData = sliceGenerator(data);

    // clear existing SVG + legend
    svg.selectAll("*").remove();
    legend.selectAll("*").remove();

    // Draw pie slices
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
          update();
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
          update();
        });
    });
  }

  // ---------- Filter logic ----------
  function getFilteredProjects() {
    let filtered = projects.filter((p) => {
      const text = Object.values(p).join(" ").toLowerCase();
      return text.includes(query.toLowerCase());
    });

    if (selectedIndex !== -1) {
      const grouped = groupData(projects);
      const selectedYear = grouped[selectedIndex]?.label;
      filtered = filtered.filter((p) => p.year === selectedYear);
    }

    return filtered;
  }

  // ---------- Update all ----------
  function update() {
    const filtered = getFilteredProjects();
    renderProjects(filtered, projectsContainer, "h2");
    renderPieChart(filtered);
  }

  // ---------- Search logic ----------
  searchInput.addEventListener("input", (e) => {
    query = e.target.value;
    update();
  });

  // ---------- Initial render ----------
  renderProjects(projects, projectsContainer, "h2");
  renderPieChart(projects);
}

loadProjects();