console.log("IT’S ALIVE!");

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// Step 2: Automatic current page link
let navLinks = $$("nav a");

// 找到当前页面的链接（匹配 host + pathname）
let currentLink = navLinks.find(
  (a) => a.host === location.host && a.pathname === location.pathname
);

// 如果找到匹配项，就自动加上 current 类
currentLink?.classList.add("current");