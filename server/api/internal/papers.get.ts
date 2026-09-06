import { $fetch } from "ofetch";
import { isInternalAuthed } from "../../utils/internal-auth.event";

export default defineEventHandler(async (event) => {
  if (!isInternalAuthed(event)) {
    throw createError({ statusCode: 401, statusMessage: "未授权访问" });
  }
  const { clouderyApiBase } = useRuntimeConfig();
  try {
    return await $fetch(`${clouderyApiBase}/exam/papers`);
  } catch {
    throw createError({ statusCode: 502, statusMessage: "试卷服务暂不可用" });
  }
});