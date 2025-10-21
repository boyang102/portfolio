import { fetchJSON, renderProjects, fetchGitHubData } from './global.js';

async function main() {
  // ---------- Step 2: 显示最新 3 个项目 ----------
  const projects = await fetchJSON('/portfolio/lib/projects.json');
  const latestProjects = projects.slice(0, 3);
  const projectsContainer = document.querySelector('.projects');
  renderProjects(latestProjects, projectsContainer, 'h3');

  // ---------- Step 3: 加载 GitHub 数据 ----------
  const profileStats = document.querySelector('#profile-stats');
  const githubData = await fetchGitHubData('boyang102'); // 👈 改成你的 GitHub 用户名

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