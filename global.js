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
    : "/website/"; // ⚠️ 请改成你的 GitHub Pages 仓库名，例如 "/portfolio/"

// 生成导航链接
for (let p of pages) {
  // 复制 url/title
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

  // 如果是外部链接（GitHub），让它在新标签页打开
  a.toggleAttribute("target", a.host !== location.host);

  // 加入导航栏
  nav.append(a);
}