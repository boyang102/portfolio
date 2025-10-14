console.log("IT’S ALIVE!");

// ---------- 工具函数 ----------
function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// ---------- Step 3: Automatic Navigation Menu ----------

// 定义网站页面数据
let pages = [
  { url: "", title: "Home" },
  { url: "projects/", title: "Projects" },
  { url: "contact/", title: "Contact" },
  { url: "resume/", title: "Resume" },
  { url: "https://github.com/boyang102", title: "GitHub" },
];

// 创建导航栏元素并插入 body 开头
let nav = document.createElement("nav");
document.body.prepend(nav);

// 定义本地/线上路径前缀（GitHub Pages 用仓库名）
const BASE_PATH =
  location.hostname === "localhost" || location.hostname === "127.0.0.1"
    ? "/" // 本地运行
    : "/website/"; // ⚠️ 改成你的 GitHub Pages 仓库名，例如 "/portfolio/"

// 生成导航链接
for (let p of pages) {
  let url = p.url;
  let title = p.title;

  // 如果是内部链接，添加 BASE_PATH 前缀
  url = !url.startsWith("http") ? BASE_PATH + url : url;

  // 创建 <a> 元素
  let a = document.createElement("a");
  a.href = url;
  a.textContent = title;

  // 如果是当前页面，添加 current 类
  a.classList.toggle(
    "current",
    a.host === location.host && a.pathname === location.pathname
  );

  // 如果是外部链接（GitHub），新标签页打开
  a.toggleAttribute("target", a.host !== location.host);

  // 加入导航栏
  nav.append(a);
}

// ---------- Step 4: Dark Mode Switch ----------

document.body.insertAdjacentHTML(
  "afterbegin",
  `
  <label class="color-scheme">
    Theme:
    <select>
      <option value="light dark">Automatic</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  </label>
`
);

// 获取 <select> 元素
let select = document.querySelector(".color-scheme select");

// 设置主题的统一函数
function setColorScheme(scheme) {
  document.documentElement.style.setProperty("color-scheme", scheme);
  select.value = scheme;
}

// 页面加载时读取本地偏好
if ("colorScheme" in localStorage) {
  setColorScheme(localStorage.colorScheme);
}

// 用户切换主题时更新
select.addEventListener("input", (event) => {
  const scheme = event.target.value;
  setColorScheme(scheme);
  localStorage.colorScheme = scheme; // 保存偏好
  console.log("Color scheme changed to:", scheme);
});