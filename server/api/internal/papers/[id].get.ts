import { $fetch } from "ofetch";
import { isInternalAuthed } from "../../../utils/internal-auth.event";

export default defineEventHandler(async (event) => {
  if (!isInternalAuthed(event)) {
    throw createError({ statusCode: 401, statusMessage: "未授权访问" });
  }
  const id = (getRouterParam(event, "id") || "").toLowerCase();
  const { clouderyApiBase } = useRuntimeConfig();
  try {
    return await $fetch(`${clouderyApiBase}/exam/ExamPapers/${id}`);
  } catch (e: any) {
    if (e?.statusCode === 404) throw createError({ statusCode: 404, statusMessage: "未找到该试卷" });
    throw createError({ statusCode: 502, statusMessage: "试卷服务暂不可用" });
  }
});