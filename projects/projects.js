import { fetchJSON, renderProjects } from '../global.js';

async function main() {
  const projectsContainer = document.querySelector('.projects');
  const projects = await fetchJSON('/portfolio/lib/projects.json'); // ✅ GitHub Pages 用这个路径

  renderProjects(projects, projectsContainer, 'h2');

  const titleElement = document.querySelector('.projects-title');
  if (titleElement && projects) {
    titleElement.textContent = `Projects (${projects.length})`;
  }
}

main();