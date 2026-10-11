import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

// 全部为源码文本的静态契约测试：不 defineEventHandler、不挂载组件、不新增依赖。
const ROOT = fileURLToPath(new URL("../", import.meta.url));
const join = (...parts: string[]) => path.join(ROOT, ...parts);

function walk(
  dir: string,
  filter: (file: string) => boolean,
  out: string[] = [],
): string[] {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, filter, out);
    else if (filter(full)) out.push(full);
  }
  return out;
}

// 宽松提取 testId 字面量：宁可多提取也不漏。
// 覆盖注册表的 `id: xxxBuilder`、`key: 'id'`、分支链的 `case 'id'` 与 `=== 'id'`。
function extractTestIdLiterals(source: string): Set<string> {
  const ids = new Set<string>();
  for (const m of source.matchAll(/['"]([A-Za-z][A-Za-z0-9_-]*)['"]\s*:/g)) ids.add(m[1]!);
  for (const m of source.matchAll(/\bcase\s+['"]([A-Za-z][A-Za-z0-9_-]*)['"]/g)) ids.add(m[1]!);
  for (const m of source.matchAll(/===\s*['"]([A-Za-z][A-Za-z0-9_-]*)['"]/g)) ids.add(m[1]!);
  for (const m of source.matchAll(/^\s*['"]?([A-Za-z][A-Za-z0-9_-]*)['"]?\s*:\s*[A-Za-z_$][\w$]*Builder\b/gm)) {
    ids.add(m[1]!);
  }
  return ids;
}

// ---- 4) enrichedScale 白名单 vs 维度组件分支 / 注册表 ----
describe("结果页维度白名单与维度注册表不漂移", () => {
  const resultVue = readFileSync(join("app", "pages", "result.vue"), "utf8");
  const scaleBlock = resultVue.slice(resultVue.indexOf("const enrichedScale"));
  const scaleMatch = scaleBlock.match(/\[([^\]]*)\]\.includes\(/);
  const enrichedIds = (scaleMatch?.[1] ?? "")
    .split(",")
    .map((token) => token.trim().replace(/^['"]|['"]$/g, ""))
    .filter(Boolean);

  // 注册表形态优先；同时兼容 ResultDimensions.vue 的 if/else 分支链形态，
  // 两种形态并存时取并集，保证提取器不会因为重构而失效。
  const dimensionConfigFiles = walk(
    join("app", "utils", "dimension-configs"),
    (f) => f.endsWith(".ts"),
  );
  const resultDimensionsFile = join("app", "components", "ResultDimensions.vue");

  const branchIds = new Set<string>();
  for (const file of dimensionConfigFiles) {
    for (const id of extractTestIdLiterals(readFileSync(file, "utf8"))) branchIds.add(id);
  }
  if (existsSync(resultDimensionsFile)) {
    for (const id of extractTestIdLiterals(readFileSync(resultDimensionsFile, "utf8"))) {
      branchIds.add(id);
    }
  }

  const registryKeys = new Set<string>();
  for (const file of dimensionConfigFiles) {
    const source = readFileSync(file, "utf8");
    const re = /^\s*['"]?([A-Za-z][A-Za-z0-9_-]*)['"]?\s*:\s*[A-Za-z_$][\w$]*Builder\b/gm;
    for (const m of source.matchAll(re)) registryKeys.add(m[1]!);
  }

  it("两种形态至少存在一种，且白名单非空无重复", () => {
    expect(dimensionConfigFiles.length > 0 || existsSync(resultDimensionsFile)).toBe(true);
    expect(enrichedIds.length).toBeGreaterThan(0);
    expect(new Set(enrichedIds).size).toBe(enrichedIds.length);
  });

  it("注册表自身的键集与 enrichedScale 白名单一一对应", () => {
    expect(registryKeys.size).toBeGreaterThan(0);
    for (const id of enrichedIds) expect(registryKeys.has(id), id).toBe(true);
  });

  it("enrichedScale 白名单里的每个 id 都在维度分支 / 注册表里出现", () => {
    for (const id of enrichedIds) expect(branchIds.has(id), id).toBe(true);
    // 兜底：确认提取拿到了实质内容，而不是空集让上面的断言恒真。
    expect(branchIds.size).toBeGreaterThanOrEqual(enrichedIds.length);
    for (const known of ["epq", "sixteenPF", "ecrr"]) expect(branchIds.has(known), known).toBe(true);
  });
});

// ---- 5) 列表 API 的 id 登记 vs 时间窗口 / 作答前提 ----
describe("量表列表 API 与时间窗口登记不漂移", () => {
  // 量表清单已抽到 server/utils/test-catalog.ts（列表接口 / sitemap / 目录页共用一份），
  // 因此这里读清单文件本身，而不是只转发它的 list.get.ts
  const listSource = readFileSync(join("server", "utils", "test-catalog.ts"), "utf8");
  const listedIds = [...listSource.matchAll(/^\s*id:\s*"([^"]+)"\s*,?\s*$/gm)].map((m) => m[1]!);

  const timeframeSource = readFileSync(join("server", "utils", "test-timeframe.ts"), "utf8");
  function recordKeys(exportName: string): string[] {
    const start = timeframeSource.indexOf("export const " + exportName);
    const open = timeframeSource.indexOf("{", start);
    const end = timeframeSource.indexOf("\n};", open);
    const body = timeframeSource.slice(open + 1, end);
    return [...body.matchAll(/^\s{2}([A-Za-z][A-Za-z0-9_-]*):/gm)].map((m) => m[1]!);
  }
  const timeFrameKeys = recordKeys("TEST_TIME_FRAME");
  const contextHintKeys = recordKeys("TEST_CONTEXT_HINT");

  it("listedIds 非空且无重复", () => {
    expect(listedIds.length).toBeGreaterThan(0);
    expect(new Set(listedIds).size).toBe(listedIds.length);
  });

  it("提取到的时间窗口 / 作答前提登记非空", () => {
    expect(timeFrameKeys.length).toBeGreaterThan(0);
    expect(contextHintKeys.length).toBeGreaterThan(0);
  });

  it("TEST_TIME_FRAME 里登记的每个 key 都有对应列表条目", () => {
    for (const key of timeFrameKeys) expect(listedIds, key).toContain(key);
  });

  it("TEST_CONTEXT_HINT 里登记的每个 key 都有对应列表条目", () => {
    for (const key of contextHintKeys) expect(listedIds, key).toContain(key);
  });
});

// ---- 6) 页面路由 vs 静态 NuxtLink 目标 ----
describe("NuxtLink 静态目标都能命中页面路由", () => {
  const pagesDir = join("app", "pages");
  const routeSet = new Set<string>();
  for (const file of walk(pagesDir, (f) => f.endsWith(".vue"))) {
    const rel = path
      .relative(pagesDir, file)
      .replace(/\\/g, "/")
      .replace(/\.vue$/, "");
    const segments = rel
      .split("/")
      .filter((seg) => seg !== "index")
      .map((seg) => (/^\[.+\]$/.test(seg) ? ":" + seg.slice(1, -1) : seg));
    routeSet.add("/" + segments.join("/"));
  }

  // 只抓模板里的静态字面量：`(^|\s)to=` 天然排除 :to="..." 绑定，多行属性也能覆盖。
  function staticLinkTargets(source: string): string[] {
    const found: string[] = [];
    for (const tag of source.matchAll(/<NuxtLink\b([^>]*)>/gs)) {
      const attrs = tag[1] ?? "";
      const m = /(^|\s)to\s*=\s*(["\'])([^"\']*)\2/.exec(attrs);
      if (!m) continue;
      const value = m[3]!;
      if (/^(https?:)?\/\//.test(value)) continue;
      if (value.startsWith("tel:") || value.startsWith("mailto:")) continue;
      found.push(value);
    }
    return found;
  }

  const staticTargets = walk(join("app"), (f) => f.endsWith(".vue")).flatMap((file) =>
    staticLinkTargets(readFileSync(file, "utf8")),
  );

  function matchesRoute(target: string): boolean {
    const pathOnly = target.split("#")[0]!.split("?")[0]!;
    if (routeSet.has(pathOnly)) return true;
    const targetSegments = pathOnly.split("/").filter(Boolean);
    for (const route of routeSet) {
      const routeSegments = route.split("/").filter(Boolean);
      if (routeSegments.length !== targetSegments.length) continue;
      let ok = true;
      for (let i = 0; i < routeSegments.length; i++) {
        const segment = routeSegments[i]!;
        if (segment.startsWith(":")) continue;
        if (segment !== targetSegments[i]) {
          ok = false;
          break;
        }
      }
      if (ok) return true;
    }
    return false;
  }

  // 人为维护的允许列表：静态字面量命中不了任何页面路由的例外。
  // 目前为空：/login?return=%2Fhistory 去掉 query 后就是已存在的 /login 路由。
  const ALLOWED_NON_ROUTE_TARGETS = new Set<string>([]);

  it("路由表包含首页、动态段与常见静态页", () => {
    for (const route of ["/", "/history", "/test/:id", "/exam/:id", "/result"]) {
      expect(routeSet.has(route), route).toBe(true);
    }
  });

  it("确实提取到了静态 NuxtLink 目标", () => {
    expect(staticTargets.length).toBeGreaterThan(0);
  });

  it("每个静态目标要么命中路由，要么在允许列表内", () => {
    const unmatched = [...new Set(staticTargets)].filter(
      (target) => !matchesRoute(target) && !ALLOWED_NON_ROUTE_TARGETS.has(target),
    );
    expect(unmatched).toEqual([]);
  });
});

// ---- 7) SEO：预渲染 / sitemap / robots ----
describe("搜索引擎收录入口", () => {
  const nuxtConfig = readFileSync(join("nuxt.config.ts"), "utf8");
  const robots = readFileSync(join("public", "robots.txt"), "utf8");
  const catalogSource = readFileSync(join("server", "utils", "test-catalog.ts"), "utf8");
  const listedIds = [...catalogSource.matchAll(/^\s*id:\s*"([^"]+)"\s*,?\s*$/gm)].map((m) => m[1]!);
  const SITE = "https://pt.cldery.com";

  it("站点地址集中配置，换域名只需改环境变量", () => {
    expect(nuxtConfig).toContain("siteUrl: process.env.NUXT_PUBLIC_SITE_URL || '" + SITE + "'");
  });

  it("公开静态页在构建期预渲染", () => {
    for (const route of ["/", "/scales", "/about", "/resources", "/privacy"]) {
      expect(nuxtConfig, route).toContain("'" + route + "': { prerender: true }");
    }
  });

  it("robots.txt 指向 sitemap 且挡掉私有页面", () => {
    expect(robots).toContain("Sitemap: " + SITE + "/sitemap.xml");
    for (const priv of ["/login", "/account", "/history", "/trends", "/result", "/admin", "/exam"]) {
      expect(robots, priv).toContain("Disallow: " + priv);
    }
  });

  it("sitemap 覆盖全部量表与量表目录页", async () => {
    expect(listedIds.length).toBeGreaterThan(0);
    (globalThis as any).defineEventHandler = (handler: any) => handler;
    (globalThis as any).setResponseHeader = () => {};
    (globalThis as any).useRuntimeConfig = () => ({ public: { siteUrl: SITE } });
    const { default: buildSitemap } = await import("../server/routes/sitemap.xml.ts");
    const xml = String((buildSitemap as any)({}));
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain("<loc>" + SITE + "/scales</loc>");
    // 漏掉任何一张量表，sitemap 就不再是完整入口
    const missing = listedIds.filter((id) => !xml.includes("<loc>" + SITE + "/test/" + id + "</loc>"));
    expect(missing).toEqual([]);
    // 私有页面不该出现在 sitemap 里
    for (const priv of ["/login", "/result", "/history", "/trends", "/admin"]) {
      expect(xml, priv).not.toContain("<loc>" + SITE + priv + "</loc>");
    }
  });

  it("量表目录页直接从量表清单取数，不依赖运行时接口", () => {
    const page = readFileSync(join("app", "pages", "scales.vue"), "utf8");
    expect(page).toContain("from '~~/server/utils/test-catalog'");
    expect(page).toContain("'/test/' + test.id");
  });
});
