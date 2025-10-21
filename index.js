import { fetchJSON, renderProjects, fetchGitHubData } from './global.js';

async function main() {
  // ---------- 显示最新 3 个项目 ----------
  const projects = await fetchJSON('/portfolio/lib/projects.json');
  const latestProjects = projects.slice(0, 3);
  const projectsContainer = document.querySelector('.projects');
  renderProjects(latestProjects, projectsContainer, 'h3');

  // ---------- GitHub API ----------
  const profileStats = document.querySelector('#profile-stats');
  const githubData = await fetchGitHubData('boyang102');

  if (profileStats && githubData) {
    profileStats.innerHTML = `
      <dl class="github-stats">
        <dt>Public Repos:</dt><dd>${githubData.public_repos}</dd>
        <dt>Public Gists:</dt><dd>${githubData.public_gists}</dd>
        <dt>Followers:</dt><dd>${githubData.followers}</dd>
        <dt>Following:</dt><dd>${githubData.following}</dd>
      </dl>
    `;
  }
}

main();