import { testList } from "~~/server/utils/test-catalog";

// 站点地图：把「可被搜索引擎收录的公开页面」全部列出来。
// 量表页是长尾流量的主要入口（每张量表一个独立页面），所以逐条从量表清单展开；
// 量表清单只有 server/utils/test-catalog.ts 一份，新增量表时这里自动跟上，不会漏登记。
const STATIC_PATHS = [
  "/",
  "/scales",
  "/about",
  "/resources",
  "/privacy",
];

// 不进 sitemap 的页面（登录、个人中心、结果、历史、后台、内部试卷），
// 它们要么需要身份态，要么是私有数据，收录没有意义。
export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event);
  const base = String(config.public.siteUrl || "https://pt.cldery.com").replace(/\/+$/, "");
  const paths = [...STATIC_PATHS, ...testList.map((t) => `/test/${t.id}`)];
  const urls = paths
    .map((p) => `  <url><loc>${base}${p}</loc><changefreq>weekly</changefreq></url>`)
    .join("\n");
  setResponseHeader(event, "content-type", "application/xml; charset=utf-8");
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    "</urlset>",
    "",
  ].join("\n");
});
