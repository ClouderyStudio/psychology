import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { beforeEach, describe, expect, it } from "vitest";
import { ref } from "vue";

const ROOT = fileURLToPath(new URL("../", import.meta.url));
const join = (...parts: string[]) => path.join(ROOT, ...parts);
const read = (rel: string) => readFileSync(join(rel), "utf8");

// composable 在 Nuxt 里靠自动导入拿到 ref，纯 node 测试环境需要先补全局；
// document / localStorage / window 同理，否则 apply/init 会直接抛 ReferenceError。
const attributes: Record<string, string> = {};
const store = new Map<string, string>();
let systemDark = false;
let systemReduce = false;

(globalThis as any).ref = ref;
(globalThis as any).document = {
  documentElement: {
    setAttribute: (k: string, v: string) => { attributes[k] = v; },
    removeAttribute: (k: string) => { delete attributes[k]; },
  },
};
(globalThis as any).localStorage = {
  getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
  setItem: (k: string, v: string) => { store.set(k, String(v)); },
  removeItem: (k: string) => { store.delete(k); },
};
(globalThis as any).window = {
  matchMedia: (query: string) => ({
    matches: query.includes("prefers-color-scheme: dark")
      ? systemDark
      : query.includes("prefers-reduced-motion: reduce")
        ? systemReduce
        : false,
    addEventListener: () => {},
    removeEventListener: () => {},
  }),
};

const a11y = await import("../app/composables/useA11yPrefs");
const theme = await import("../app/composables/useTheme");

const MOTION_KEY = "psychology-reduced-motion";

function resetA11y() {
  store.clear();
  systemDark = false;
  systemReduce = false;
  a11y.useA11yPrefs().setMotionMode("auto");
}

// ---- 1) app/composables/useA11yPrefs.ts：减少动态效果三档 ----
describe("useA11yPrefs：减少动态效果三档", () => {
  beforeEach(resetA11y);

  it("导出 motionMode / setMotionMode / motionModeOptions / init / prefersReducedMotion", () => {
    const api = a11y.useA11yPrefs();
    expect(typeof api.setMotionMode).toBe("function");
    expect(typeof api.init).toBe("function");
    expect(typeof api.prefersReducedMotion).toBe("function");
    expect(api.motionMode).toBeDefined();
    expect(api.motionModeOptions).toHaveLength(3);
  });

  it("三档恰为 跟随系统 / 减少动态 / 常规动态", () => {
    expect(a11y.motionModeOptions.map((o: any) => o.id)).toEqual(["auto", "reduce", "no-preference"]);
    for (const opt of a11y.motionModeOptions) {
      expect(opt.label.length).toBeGreaterThan(0);
      expect(opt.desc.length).toBeGreaterThan(0);
    }
  });

  it("选「减少动态」写 html 属性 reduce 并持久化", () => {
    const { motionMode, setMotionMode } = a11y.useA11yPrefs();
    setMotionMode("reduce");
    expect(motionMode.value).toBe("reduce");
    expect(attributes["data-reduced-motion"]).toBe("reduce");
    expect(store.get(MOTION_KEY)).toBe("reduce");
  });

  it("选「常规动态」写 no-preference 并持久化", () => {
    const { motionMode, setMotionMode } = a11y.useA11yPrefs();
    setMotionMode("no-preference");
    expect(motionMode.value).toBe("no-preference");
    expect(attributes["data-reduced-motion"]).toBe("no-preference");
    expect(store.get(MOTION_KEY)).toBe("no-preference");
  });

  it("选「跟随系统」清除存储并写回 auto", () => {
    const { motionMode, setMotionMode } = a11y.useA11yPrefs();
    setMotionMode("reduce");
    setMotionMode("auto");
    expect(motionMode.value).toBe("auto");
    expect(attributes["data-reduced-motion"]).toBe("auto");
    expect(store.has(MOTION_KEY)).toBe(false);
  });

  it("非法档位回落到跟随系统", () => {
    const { motionMode, setMotionMode } = a11y.useA11yPrefs();
    setMotionMode("nonsense" as any);
    expect(motionMode.value).toBe("auto");
  });

  it("init 从 localStorage 恢复档位，无存储时默认跟随系统", () => {
    const { motionMode, init } = a11y.useA11yPrefs();
    store.set(MOTION_KEY, "no-preference");
    init();
    expect(motionMode.value).toBe("no-preference");
    expect(attributes["data-reduced-motion"]).toBe("no-preference");

    store.clear();
    init();
    expect(motionMode.value).toBe("auto");
    expect(attributes["data-reduced-motion"]).toBe("auto");
  });

  it("prefersReducedMotion：显式档位优先，auto 才回落到系统偏好", () => {
    const { setMotionMode, prefersReducedMotion } = a11y.useA11yPrefs();

    // 跟随系统：由系统偏好决定
    systemReduce = false;
    expect(prefersReducedMotion()).toBe(false);
    systemReduce = true;
    expect(prefersReducedMotion()).toBe(true);

    // 显式减少：系统为常规也生效
    systemReduce = false;
    setMotionMode("reduce");
    expect(prefersReducedMotion()).toBe(true);

    // 显式常规：系统为减少也能关掉（这就是用户报的「重新关闭无效」）
    systemReduce = true;
    setMotionMode("no-preference");
    expect(prefersReducedMotion()).toBe(false);
  });

  it("开关与 localStorage key 在首屏内联脚本中保持一致", () => {
    const a11ySource = read("app/composables/useA11yPrefs.ts");
    const config = read("nuxt.config.ts");
    expect(a11ySource).toContain(MOTION_KEY);
    expect(config).toContain(MOTION_KEY);
    expect(config).toContain("data-reduced-motion");
    // 首屏脚本必须把 no-preference 也还原出来，否则刷新后又被系统值盖回去
    expect(config).toContain("rm==='no-preference'");
  });
});

// ---- 2) app/composables/useTheme.ts：亮/暗/跟随系统三档 ----
describe("useTheme：外观三档", () => {
  beforeEach(() => {
    store.clear();
    systemDark = false;
    theme.useTheme().init();
    theme.useTheme().setThemeMode("light");
  });

  it("themeModeOptions 恰为 浅色 / 深色 / 跟随系统", () => {
    expect(theme.themeModeOptions.map((o: any) => o.id)).toEqual(["light", "dark", "auto"]);
    for (const opt of theme.themeModeOptions) {
      expect(opt.label.length).toBeGreaterThan(0);
      expect(opt.desc.length).toBeGreaterThan(0);
    }
  });

  it("浅色 / 深色写入 localStorage 并设置 data-theme", () => {
    const api = theme.useTheme();
    api.setThemeMode("dark");
    expect(api.isDark.value).toBe(true);
    expect(attributes["data-theme"]).toBe("dark");
    expect(store.get("psychology-theme")).toBe("dark");

    api.setThemeMode("light");
    expect(api.isDark.value).toBe(false);
    expect(attributes["data-theme"]).toBe("light");
    expect(store.get("psychology-theme")).toBe("light");
  });

  it("跟随系统时清除存储并按 prefers-color-scheme 取值", () => {
    const api = theme.useTheme();
    store.set("psychology-theme", "light");
    systemDark = true;
    api.setThemeMode("auto");
    expect(api.themeMode.value).toBe("auto");
    expect(api.isDark.value).toBe(true);
    expect(attributes["data-theme"]).toBe("dark");
    expect(store.has("psychology-theme")).toBe(false);

    systemDark = false;
    api.setThemeMode("auto");
    expect(api.isDark.value).toBe(false);
  });

  it("非法档位回落到跟随系统", () => {
    const api = theme.useTheme();
    api.setThemeMode("nonsense" as any);
    expect(api.themeMode.value).toBe("auto");
  });

  it("init 三分支：dark / light / 无存储跟随系统", () => {
    const api = theme.useTheme();
    store.set("psychology-theme", "dark");
    api.init();
    expect(api.themeMode.value).toBe("dark");
    expect(api.isDark.value).toBe(true);

    store.set("psychology-theme", "light");
    api.init();
    expect(api.themeMode.value).toBe("light");
    expect(api.isDark.value).toBe(false);

    store.clear();
    systemDark = true;
    api.init();
    expect(api.themeMode.value).toBe("auto");
    expect(api.isDark.value).toBe(true);
  });

  it("toggle 只在浅/深之间切换，不进入跟随系统", () => {
    const api = theme.useTheme();
    api.setThemeMode("light");
    api.toggle();
    expect(api.themeMode.value).toBe("dark");
    api.toggle();
    expect(api.themeMode.value).toBe("light");
  });
});

// ---- 3) 静态契约：入口合并与 CSS 钩子 ----
describe("偏好设置：静态契约", () => {
  const navBar = read("app/components/NavBar.vue");
  const appVue = read("app/app.vue");
  const css = read("app/assets/css/tailwind.css");
  const testPage = read("app/pages/test/[id].vue");

  it("导航栏只剩一个偏好设置面板 ref，旧的配色/字体面板已删除", () => {
    expect(navBar).toContain("prefWrap");
    expect(navBar).toContain("prefOpen");
    expect(navBar).toContain("togglePrefPanel");
    for (const gone of ["accentOpen", "accentWrap", "fontOpen", "fontWrap", "toggleTheme"]) {
      expect(navBar).not.toContain(gone);
    }
  });

  it("导航栏同时提供外观、配色、阅读偏好与无障碍四组设置", () => {
    for (const token of ["themeModeOptions", "accentOptions", "fontScaleOptions", "fontFamilyOptions", "fontWeightOptions", "hanVariantOptions", "motionModeOptions", "setMotionMode"]) {
      expect(navBar).toContain(token);
    }
    expect(navBar).toContain("减少动态效果");
    // 无障碍也从布尔开关改成了三档
    expect(navBar).not.toContain("setReducedMotion");
  });

  it("桌面与移动端都不再保留独立的浅/深切换按钮", () => {
    expect(navBar).not.toContain("切换到浅色模式");
    expect(navBar).not.toContain("切换到深色模式");
  });

  it("app.vue 初始化 useA11yPrefs", () => {
    expect(appVue).toContain("useA11yPrefs");
    expect(appVue).toContain("initA11yPrefs()");
  });

  it("CSS 同时响应系统偏好与站内开关，且「常规动态」能覆盖系统设置", () => {
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
    expect(css).toContain("html[data-reduced-motion='reduce']");
    // 系统设为「减少」时，站内显式选「常规动态」必须能关掉，否则又回到用户报的 bug
    expect(css).toContain("html:not([data-reduced-motion='no-preference'])");
  });

  it("作答页的自动前进与平滑滚动改走统一的 prefersReducedMotion()", () => {
    expect(testPage).toContain("prefersReducedMotion()");
    expect(testPage).not.toContain("motionQuery");
    expect(testPage).not.toContain("syncReducedMotion");
  });
});

