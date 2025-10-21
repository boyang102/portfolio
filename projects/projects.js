import { fetchJSON, renderProjects } from '../global.js';

async function main() {
  const projectsContainer = document.querySelector('.projects');
  const projects = await fetchJSON('../lib/projects.json');
  renderProjects(projects, projectsContainer, 'h2');
}

main();

const titleElement = document.querySelector('.projects-title');
if (titleElement && projects) {
  titleElement.textContent = `Projects (${projects.length})`;
}