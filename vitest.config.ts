import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// server/api 下的处理器用 Nitro 的 ~~ 别名导入 server/utils，
// 纯 node 测试环境里没有这层解析，直接调用处理器时必须补上，
// 否则测试只能绕过接口去测内部函数，接口拼装错误就测不出来。
const serverUtils = fileURLToPath(new URL("./server", import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "~~/server": serverUtils,
      "~~": fileURLToPath(new URL(".", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
});
