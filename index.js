import { fetchJSON, renderProjects } from './global.js';

async function main() {
  const allProjects = await fetchJSON('./lib/projects.json');

  // 取前 3 个项目
  const latestProjects = allProjects.slice(0, 3);

  // 找到主页的 projects 容器
  const projectsContainer = document.querySelector('.projects');
  renderProjects(latestProjects, projectsContainer, 'h3');
}

main();