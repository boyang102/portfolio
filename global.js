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
    : "/portfolio/"; // ✅ 正确路径（GitHub Pages 仓库名）

// 生成导航链接
for (let p of pages) {
  let url = p.url;
  let title = p.title;

 // 确保所有相对路径都以 index.html 结尾（GitHub Pages 兼容性更好）
if (!url.startsWith("http")) {
    url = BASE_PATH + url + "index.html";
  }

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
})

// ---------- Step 5: Better Contact Form (Optional) ----------

// 1️⃣ 获取表单（不是每个页面都有）
const form = document.querySelector("form");

// 2️⃣ 如果存在，就添加监听器
form?.addEventListener("submit", (event) => {
  event.preventDefault(); // 阻止默认提交

  // 3️⃣ 获取表单数据
  const data = new FormData(form);
  const params = [];

  // 4️⃣ 遍历所有字段并进行标准 URL 编码
  for (let [name, value] of data) {
    params.push(`${name}=${encodeURIComponent(value)}`);
  }

  // 5️⃣ 拼接 mailto URL
  // 例如 mailto:boyang@ucsd.edu?subject=Hello&body=Message
  const url = `${form.action}?${params.join("&")}`;

  console.log("Generated mailto URL:", url);

  // 6️⃣ 打开用户邮箱客户端并带入表单内容
  location.href = url;
});