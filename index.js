import { fetchJSON, renderProjects } from './global.js';

async function main() {
  const allProjects = await fetchJSON('/portfolio/lib/projects.json');
  const latestProjects = allProjects.slice(0, 3); // 取前三个项目

  const projectsContainer = document.querySelector('.projects');
  renderProjects(latestProjects, projectsContainer, 'h3');
}

main();